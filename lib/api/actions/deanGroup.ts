"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { studentDeanGroups, timeslotOverrides, timeslots } from "@/db/schema"
import { and, eq, not, notInArray } from "drizzle-orm"

import { validatedAction } from "@/lib/actionValidator"
import { UnauthenticatedException } from "@/lib/exceptions"
import { getCurrentUser } from "@/lib/session"
import { updateDeanGroupSchema } from "@/lib/validators/deanGroup"

export const updateDeanGroup = validatedAction(
  updateDeanGroupSchema,
  async ({ deanGroup: newDeanGroupId, mode }) => {
    const user = await getCurrentUser()
    if (!user) throw new UnauthenticatedException()

    if (user.deanGroup.id === newDeanGroupId)
      return { message: "Successfully updated dean group" }

    await db.transaction(async (tx) => {
      if (mode === "replace") {
        await tx
          .delete(timeslotOverrides)
          .where(eq(timeslotOverrides.studentId, user.id))
      } else {
        const overridedCourseIds = await tx
          .select({ courseId: timeslotOverrides.courseId })
          .from(timeslotOverrides)
          .where(
            and(
              eq(timeslotOverrides.studentId, user.id),
              not(eq(timeslotOverrides.deanGroupId, user.deanGroup.id)),
            ),
          )
          .then((result) => result.map(({ courseId }) => courseId))

        const coursesToOverrideIds = await tx
          .select({ courseId: timeslots.courseId })
          .from(timeslots)
          .where(
            and(
              eq(timeslots.deanGroupId, user.deanGroup.id),
              overridedCourseIds.length !== 0
                ? notInArray(timeslots.courseId, overridedCourseIds)
                : undefined,
            ),
          )
          .then((result) => result.map(({ courseId }) => courseId))

        if (coursesToOverrideIds.length !== 0)
          await tx.insert(timeslotOverrides).values(
            coursesToOverrideIds.map((courseId) => ({
              courseId,
              studentId: user.id,
              deanGroupId: user.deanGroup.id,
            })),
          )

        await tx
          .delete(timeslotOverrides)
          .where(
            and(
              eq(timeslotOverrides.studentId, user.id),
              eq(timeslotOverrides.deanGroupId, newDeanGroupId),
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
