import { db } from "@/db"
import { timeslots, timeslotsOverrides } from "@/db/schema"
import { eq, inArray, ne, notInArray } from "drizzle-orm"

export const getUserTimetable = (student: {
  id: string
  deanGroup: number
}) => {
  const customTimeslotsIds = db
    .select({ id: timeslotsOverrides.courseId })
    .from(timeslotsOverrides)
    .where(eq(timeslotsOverrides.studentId, student.id))

  return db.query.timeslots.findMany({
    with: {
      course: true,
    },
    where: ({ deanGroup, courseId }, { or, and, eq }) =>
      or(
        eq(deanGroup, 0),
        and(
          eq(deanGroup, student.deanGroup),
          notInArray(courseId, customTimeslotsIds),
        ),
        and(
          ne(deanGroup, student.deanGroup),
          inArray(courseId, customTimeslotsIds),
        ),
      ),
  })
}

export const getCoursesTimeslots = (ids: number[]) =>
  db.select().from(timeslots).where(inArray(timeslots.courseId, ids))

export type TimetableEntry = Awaited<ReturnType<typeof getUserTimetable>>[0]
