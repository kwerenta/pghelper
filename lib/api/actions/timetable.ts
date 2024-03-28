"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { timeslotOverrides } from "@/db/schema"
import { and, eq, inArray } from "drizzle-orm"

import { validatedAction } from "@/lib/actionValidator"
import { UnauthenticatedException } from "@/lib/exceptions"
import { getCurrentUser } from "@/lib/session"
import { timetableEditorSchema } from "@/lib/validators/timetable"

export const updateTimetable = validatedAction(
  timetableEditorSchema,
  async (input) => {
    const user = await getCurrentUser()
    if (!user) throw new UnauthenticatedException()

    await db.transaction(async (tx) => {
      await tx.delete(timeslotOverrides).where(
        and(
          inArray(
            timeslotOverrides.courseId,
            input.timeslots.map((entry) => entry.courseId),
          ),
          eq(timeslotOverrides.studentId, user.id),
        ),
      )

      const overridesToInsert = input.timeslots.map((entry) => ({
        courseId: entry.courseId,
        studentId: user.id,
        timeslotId: entry.timeslotId,
      }))

      if (overridesToInsert.length !== 0)
        await tx.insert(timeslotOverrides).values(overridesToInsert)
    })

    revalidatePath("/timetable")
    return { message: "Successfully updated timetable." }
  },
)
