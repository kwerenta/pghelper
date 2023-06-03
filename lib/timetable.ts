import { db } from "@/db"
import { studentAttendances } from "@/db/schema"
import { User } from "@clerk/nextjs/dist/server"
import { eq, inArray, ne, notInArray } from "drizzle-orm"
import { alias } from "drizzle-orm/mysql-core"

export const getUserTimetable = async (student: User | null) => {
  const studentData: { deanGroup?: number } = student!.unsafeMetadata

  const sa = alias(studentAttendances, "sa")
  const attendanceQuery = db
    .select({ id: sa.courseId })
    .from(sa)
    .where(eq(sa.studentId, student!.id))

  return await db.query.timetable.findMany({
    with: {
      course: true,
    },
    where: ({ deanGroup, courseId }, { or, and, eq }) =>
      or(
        eq(deanGroup, 0),
        and(
          eq(deanGroup, studentData.deanGroup ?? 0),
          notInArray(courseId, attendanceQuery)
        ),
        and(
          ne(deanGroup, studentData.deanGroup ?? 0),
          inArray(courseId, attendanceQuery)
        )
      ),
  })
}
