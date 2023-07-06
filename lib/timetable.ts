import { db } from "@/db"
import { studentAttendances } from "@/db/schema"
import { eq, inArray, ne, notInArray } from "drizzle-orm"
import { alias } from "drizzle-orm/mysql-core"

export const getUserTimetable = (student: {
  id: string
  deanGroup: number
}) => {
  const sa = alias(studentAttendances, "sa")
  const attendanceQuery = db
    .select({ id: sa.courseId })
    .from(sa)
    .where(eq(sa.studentId, student.id))

  return db.query.timetable.findMany({
    with: {
      course: true,
    },
    where: ({ deanGroup, courseId }, { or, and, eq }) =>
      or(
        eq(deanGroup, 0),
        and(
          eq(deanGroup, student.deanGroup),
          notInArray(courseId, attendanceQuery)
        ),
        and(
          ne(deanGroup, student.deanGroup),
          inArray(courseId, attendanceQuery)
        )
      ),
  })
}

export type TimetableEntry = Awaited<ReturnType<typeof getUserTimetable>>[0]
