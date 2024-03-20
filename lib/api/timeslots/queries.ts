import "server-only"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { timeslotOverrides, timeslots } from "@/db/schema"
import { eq, inArray, ne, notInArray, or } from "drizzle-orm"

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
    where: ({ deanGroup, courseId }, { or, and, eq }) =>
      or(
        eq(deanGroup, 0),
        and(
          eq(deanGroup, user.deanGroup),
          notInArray(courseId, customTimeslotsIds),
        ),
        and(
          ne(deanGroup, user.deanGroup),
          inArray(courseId, customTimeslotsIds),
        ),
      ),
  })
}
export type TimetableEntry = Awaited<
  ReturnType<typeof getUserTimetable>
>[number]

export const getTimeslotsByDeanGroup = async (deanGroup: number) =>
  await db.query.timeslots.findMany({
    with: {
      course: true,
    },
    where: or(eq(timeslots.deanGroup, deanGroup), eq(timeslots.deanGroup, 0)),
  })

export const getTimeslotsByCourses = async (ids: number[]) =>
  await db.select().from(timeslots).where(inArray(timeslots.courseId, ids))

export const getDeanGroups = async () =>
  await db
    .selectDistinct({ deanGroup: timeslots.deanGroup })
    .from(timeslots)
    .where(ne(timeslots.deanGroup, 0))
    .then((data) => data.map(({ deanGroup }) => deanGroup))
