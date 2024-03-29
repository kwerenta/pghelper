"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { studentDeanGroups, timeslotOverrides, timeslots } from "@/db/schema"
import { and, eq, inArray, isNull, not, notInArray, sql } from "drizzle-orm"

import { validatedAction } from "@/lib/actionValidator"
import { UnauthenticatedException } from "@/lib/exceptions"
import { getCurrentUser } from "@/lib/session"
import { updateDeanGroupSchema } from "@/lib/validators/deanGroup"

export const updateDeanGroup = validatedAction(
  updateDeanGroupSchema,
  async ({ deanGroup: newDeanGroupId, action }) => {
    const user = await getCurrentUser()
    if (!user) throw new UnauthenticatedException()

    if (user.deanGroup.id === newDeanGroupId)
      return { message: "Successfully updated dean group" }

    await db.transaction(async (tx) => {
      if (action === "replace") {
        await tx
          .delete(timeslotOverrides)
          .where(eq(timeslotOverrides.studentId, user.id))
      } else {
        const overridedCourseIds = tx
          .select({ courseId: timeslotOverrides.courseId })
          .from(timeslotOverrides)
          .where(eq(timeslotOverrides.studentId, user.id))

        const timeslotToOverrideIds = await tx
          .select({ timeslotId: timeslots.id, courseId: timeslots.courseId })
          .from(timeslots)
          .where(
            and(
              eq(timeslots.deanGroupId, user.deanGroup.id),
              isNull(timeslots.subgroup),
              notInArray(timeslots.courseId, overridedCourseIds),
            ),
          )

        if (timeslotToOverrideIds.length !== 0)
          await tx.insert(timeslotOverrides).values(
            timeslotToOverrideIds.map(({ timeslotId, courseId }) => ({
              timeslotId,
              courseId,
              studentId: user.id,
            })),
          )

        const newDeanGroupOverrides = db.$with("new_dean_group_overrides").as(
          db
            .select({ id: timeslotOverrides.id })
            .from(timeslotOverrides)
            .innerJoin(
              timeslots,
              eq(timeslotOverrides.timeslotId, timeslots.id),
            )
            .where(
              and(
                eq(timeslotOverrides.studentId, user.id),
                isNull(timeslots.subgroup),
                eq(timeslots.deanGroupId, newDeanGroupId),
              ),
            ),
        )

        await tx
          .with(newDeanGroupOverrides)
          .delete(timeslotOverrides)
          .where(
            inArray(
              timeslotOverrides.id,
              sql`(SELECT id FROM ${newDeanGroupOverrides})`,
            ),
          )
      }

      await tx
        .update(studentDeanGroups)
        .set({ isActive: false })
        .where(eq(studentDeanGroups.studentId, user.id))

      await tx
        .insert(studentDeanGroups)
        .values({
          deanGroupId: newDeanGroupId,
          studentId: user.id,
          isActive: true,
        })
        .onDuplicateKeyUpdate({ set: { isActive: true } })
    })

    revalidatePath("/settings")
    return { message: "Successfully updated dean group" }
  },
)
