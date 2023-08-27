"use server"

import { db } from "@/db"
import { timeslotsOverrides } from "@/db/schema"
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

    const data = input.timeslots.map((entry) => ({
      ...entry,
      studentId: user.id,
    }))

    await db.transaction(async (tx) => {
      await tx.delete(timeslotsOverrides).where(
        and(
          inArray(
            timeslotsOverrides.courseId,
            data.map((entry) => entry.courseId),
          ),
          eq(timeslotsOverrides.studentId, user.id),
        ),
      )

      const timeslotsToInsert = data.filter(
        (entry) => entry.deanGroup !== user.deanGroup,
      )

      if (timeslotsToInsert.length !== 0)
        await tx.insert(timeslotsOverrides).values(timeslotsToInsert)
    })
  },
)
