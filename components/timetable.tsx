import { db } from "@/db"
import { studentAttendances } from "@/db/schema"
import { eq, inArray, ne, notInArray } from "drizzle-orm"
import { alias } from "drizzle-orm/mysql-core"

import {
  DAYS_OF_WEEK,
  FIRST_SUBJECT_HOUR,
  LAST_SUBJECT_HOUR,
} from "@/config/timetable"

import { Timeslot } from "./timeslot"

export async function Timetable() {
  const student = { id: 1, deanGroup: 3 }

  const sa = alias(studentAttendances, "sa")
  const attendanceQuery = db
    .select({ id: sa.courseId })
    .from(sa)
    .where(eq(sa.studentId, student.id))
  const entries = await db.query.timetable.findMany({
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
          {Array.from({
            length: LAST_SUBJECT_HOUR - FIRST_SUBJECT_HOUR + 1,
          }).map((_, i) => (
            <tr key={i} className="text-center">
              <th className="sticky left-0 bg-background p-2 capitalize sm:px-3 lg:px-4">
                {i + FIRST_SUBJECT_HOUR}:00
              </th>
              {DAYS_OF_WEEK.map((weekday) => {
                const course = entries.find(
                  (entry) =>
                    entry.weekday === weekday &&
                    entry.startTime <= i + FIRST_SUBJECT_HOUR &&
                    entry.endTime > i + FIRST_SUBJECT_HOUR
                )?.course
                return <Timeslot key={weekday + i} course={course} />
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
