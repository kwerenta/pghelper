import "server-only"
import { notFound } from "next/navigation"
import { db } from "@/db"
import {
  DeanGroupId,
  SemesterId,
  Timeslot,
  courses,
  timeslotExceptions,
  timeslotOverrides,
  timeslots,
} from "@/db/schema"
import {
  and,
  eq,
  getTableColumns,
  inArray,
  isNull,
  notInArray,
  or,
} from "drizzle-orm"

import { getCurrentUser } from "@/lib/session"

export const getUserTimetable = async () => {
  const user = await getCurrentUser()
  if (!user) notFound()

  const overridedTimeslots = db.$with("overrided_timeslots").as(
    db
      .select({
        timeslotId: timeslotOverrides.timeslotId,
        courseId: timeslotOverrides.courseId,
      })
      .from(timeslotOverrides)
      .innerJoin(courses, eq(timeslotOverrides.courseId, courses.id))
      .where(
        and(
          eq(courses.semesterId, user.deanGroup.semesterId),
          eq(timeslotOverrides.studentId, user.id),
        ),
      ),
  )

  const overridedTimeslotIds = db
    .select({ timeslotId: overridedTimeslots.timeslotId })
    .from(overridedTimeslots)

  const overridedCourseIds = db
    .select({ courseId: overridedTimeslots.courseId })
    .from(overridedTimeslots)

  return await db
    .with(overridedTimeslots)
    .select({ ...getTableColumns(timeslots), course: courses })
    .from(timeslots)
    .innerJoin(courses, eq(timeslots.courseId, courses.id))
    .where(
      and(
        eq(courses.semesterId, user.deanGroup.semesterId),
        or(
          and(isNull(timeslots.deanGroupId), isNull(timeslots.subgroup)),
          inArray(timeslots.id, overridedTimeslotIds),
          and(
            eq(timeslots.deanGroupId, user.deanGroup.id),
            isNull(timeslots.subgroup),
            notInArray(timeslots.courseId, overridedCourseIds),
          ),
        ),
      ),
    )
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
      and(isNull(timeslots.deanGroupId), isNull(timeslots.subgroup)),
    ),
  })

export const getTimeslotsBySemester = async (semesterId: SemesterId) =>
  await db
    .select(getTableColumns(timeslots))
    .from(timeslots)
    .leftJoin(courses, eq(timeslots.courseId, courses.id))
    .where(eq(courses.semesterId, semesterId))

export const getTimeslotExceptionsByTimeslots = async (
  timeslotIds: Timeslot["id"][],
) =>
  timeslotIds.length === 0
    ? []
    : await db
        .select()
        .from(timeslotExceptions)
        .where(inArray(timeslotExceptions.timeslotId, timeslotIds))
        .orderBy(timeslotExceptions.date)
