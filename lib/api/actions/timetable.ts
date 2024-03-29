"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { timeslotOverrides, timeslots } from "@/db/schema"
import { and, eq, inArray, isNull, sql } from "drizzle-orm"

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
      const overridesToInsert = input.timeslots.map((entry) => ({
        courseId: entry.courseId,
        studentId: user.id,
        timeslotId: entry.timeslotId,
      }))

      await tx
        .insert(timeslotOverrides)
        .values(overridesToInsert)
        .onDuplicateKeyUpdate({
          set: { timeslotId: sql`VALUES(${timeslotOverrides.timeslotId})` },
        })

      const unnecessaryOverrideIds = db.$with("unnecessary_override_ids").as(
        db
          .select({ id: timeslotOverrides.id })
          .from(timeslotOverrides)
          .innerJoin(timeslots, eq(timeslotOverrides.timeslotId, timeslots.id))
          .where(
            and(
              eq(timeslotOverrides.studentId, user.id),
              eq(timeslots.deanGroupId, user.deanGroup.id),
              isNull(timeslots.subgroup),
            ),
          ),
      )

      await tx
        .with(unnecessaryOverrideIds)
        .delete(timeslotOverrides)
        .where(
          inArray(
            timeslotOverrides.id,
            sql`(SELECT id FROM ${unnecessaryOverrideIds})`,
          ),
        )
    })

    revalidatePath("/timetable")
    return { message: "Successfully updated timetable." }
  },
)
