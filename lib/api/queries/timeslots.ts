import "server-only"
import { notFound } from "next/navigation"
import { db } from "@/db"
import {
  DeanGroupId,
  SemesterId,
  deanGroups,
  timeslotOverrides,
  timeslots,
} from "@/db/schema"
import { eq, inArray, isNull, ne, notInArray, or } from "drizzle-orm"

import { getCurrentUser } from "@/lib/session"

export const getUserTimetable = async () => {
  const user = await getCurrentUser()

  if (!user) notFound()

  const customTimeslotsIds = db
    .select({ id: timeslotOverrides.courseId })
    .from(timeslotOverrides)
    .where(eq(timeslotOverrides.studentId, user.id))

  return await db.query.timeslots.findMany({
    with: {
      course: true,
    },
    where: ({ deanGroupId, courseId }, { or, and, eq }) =>
      or(
        isNull(deanGroupId),
        and(
          eq(deanGroupId, user.deanGroup.id),
          notInArray(courseId, customTimeslotsIds),
        ),
        and(
          ne(deanGroupId, user.deanGroup.id),
          inArray(courseId, customTimeslotsIds),
        ),
      ),
  })
}
export type TimetableEntry = Awaited<
  ReturnType<typeof getUserTimetable>
>[number]

export const getTimeslotsByDeanGroup = async (deanGroupId: DeanGroupId) =>
  await db.query.timeslots.findMany({
    with: {
      course: true,
    },
    where: or(
      eq(timeslots.deanGroupId, deanGroupId),
      isNull(timeslots.deanGroupId),
    ),
  })

export const getTimeslotsBySemesterWithDeanGroup = async (
  semesterId: SemesterId,
) =>
  (
    await db
      .select()
      .from(timeslots)
      .innerJoin(deanGroups, eq(timeslots.deanGroupId, deanGroups.id))
      .where(eq(deanGroups.semesterId, semesterId))
  ).map((entry) => ({ ...entry.timeslot, deanGroup: { ...entry.dean_group } }))
