import { db } from "@/db"
import { studentAttendances } from "@/db/schema"
import { currentUser } from "@clerk/nextjs"
import { eq, inArray, ne, notInArray } from "drizzle-orm"
import { alias } from "drizzle-orm/mysql-core"

import {
  DAYS_OF_WEEK,
  FIRST_SUBJECT_HOUR,
  LAST_SUBJECT_HOUR,
} from "@/config/timetable"

import { Timeslot } from "./timeslot"

const hoursArray = Array.from(
  { length: LAST_SUBJECT_HOUR - FIRST_SUBJECT_HOUR + 1 },
  (_, i) => i + FIRST_SUBJECT_HOUR
)

export async function Timetable() {
  const student = await currentUser()
  const studentData: { deanGroup?: number } = student!.unsafeMetadata

  const sa = alias(studentAttendances, "sa")
  const attendanceQuery = db
    .select({ id: sa.courseId })
    .from(sa)
    .where(eq(sa.studentId, student!.id))
  const entries = await db.query.timetable.findMany({
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

  return (
    <div className="flex overflow-x-auto">
      <table className="mb-4 flex-1 text-foreground">
        <thead>
          <tr>
            <th className="sticky left-0 bg-background py-2">Hour</th>
            {DAYS_OF_WEEK.map((day, i) => (
              <th key={i} className="capitalize">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hoursArray.map((hour) => (
            <tr key={hour} className="text-center">
              <th className="sticky left-0 bg-background p-2 capitalize sm:px-3 lg:px-4">
                {hour}:00
              </th>
              {DAYS_OF_WEEK.map((weekday) => {
                const course = entries.find(
                  (entry) =>
                    entry.weekday === weekday &&
                    entry.startTime <= hour &&
                    entry.endTime > hour
                )?.course
                return <Timeslot key={weekday + hour} course={course} />
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
