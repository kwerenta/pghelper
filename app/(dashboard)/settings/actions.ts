"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { timeslots, timeslotsOverrides, users } from "@/db/schema"
import { and, eq, not, notInArray } from "drizzle-orm"

import { validatedAction } from "@/lib/actionValidator"
import { UnauthenticatedException } from "@/lib/exceptions"
import { getCurrentUser } from "@/lib/session"
import { updateDeanGroupSchema } from "@/lib/validators/deanGroup"

export const updateDeanGroup = validatedAction(
  updateDeanGroupSchema,
  async ({ deanGroup: newDeanGroup, mode }) => {
    const user = await getCurrentUser()
    if (!user) throw new UnauthenticatedException()

    if (user.deanGroup === newDeanGroup)
      return { message: "Successfully updated dean group" }

    await db.transaction(async (tx) => {
      if (mode === "replace") {
        await tx
          .delete(timeslotsOverrides)
          .where(eq(timeslotsOverrides.studentId, user.id))
      } else {
        const overridedCourseIds = await tx
          .select({ courseId: timeslotsOverrides.courseId })
          .from(timeslotsOverrides)
          .where(
            and(
              eq(timeslotsOverrides.studentId, user.id),
              not(eq(timeslotsOverrides.deanGroup, user.deanGroup)),
            ),
          )
          .then((result) => result.map(({ courseId }) => courseId))

        const coursesToOverrideIds = await tx
          .select({ courseId: timeslots.courseId })
          .from(timeslots)
          .where(
            and(
              eq(timeslots.deanGroup, user.deanGroup),
              overridedCourseIds.length !== 0
                ? notInArray(timeslots.courseId, overridedCourseIds)
                : undefined,
            ),
          )
          .then((result) => result.map(({ courseId }) => courseId))

        if (coursesToOverrideIds.length !== 0)
          await tx.insert(timeslotsOverrides).values(
            coursesToOverrideIds.map((courseId) => ({
              courseId,
              studentId: user.id,
              deanGroup: user.deanGroup,
            })),
          )

        await tx
          .delete(timeslotsOverrides)
          .where(
            and(
              eq(timeslotsOverrides.studentId, user.id),
              eq(timeslotsOverrides.deanGroup, newDeanGroup),
            ),
          )
      }

      await tx
        .update(users)
        .set({ deanGroup: newDeanGroup })
        .where(eq(users.id, user.id))
    })

    revalidatePath("/settings")
    return { message: "Successfully updated dean group" }
  },
)
