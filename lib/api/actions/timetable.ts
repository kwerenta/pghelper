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

    const data = input.timeslots.map((entry) => ({
      ...entry,
      studentId: user.id,
    }))

    // TODO: add handling for timeslots with subgroups
    await db.transaction(async (tx) => {
      await tx.delete(timeslotOverrides).where(
        and(
          inArray(
            timeslotOverrides.courseId,
            data.map((entry) => entry.courseId),
          ),
          eq(timeslotOverrides.studentId, user.id),
        ),
      )

      const timeslotsToInsert = data.filter(
        (entry) => entry.group.deanGroupId !== user.deanGroup.id,
      )

      if (timeslotsToInsert.length !== 0)
        await tx.insert(timeslotOverrides).values(timeslotsToInsert)
    })

    revalidatePath("/timetable")
    return { message: "Successfully updated timetable." }
  },
)
