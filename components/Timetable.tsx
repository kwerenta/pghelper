import {
  DAYS_OF_WEEK,
  FIRST_SUBJECT_HOUR,
  LAST_SUBJECT_HOUR,
} from "@/config/timetable"
import { getUserTimetable } from "@/lib/timetable"

import { Timeslot } from "./Timeslot"
import { Card, CardContent } from "./ui/card"

const hoursArray = Array.from(
  { length: LAST_SUBJECT_HOUR - FIRST_SUBJECT_HOUR + 1 },
  (_, i) => i + FIRST_SUBJECT_HOUR
)

export async function Timetable() {
  const entries = await getUserTimetable({ id: "", deanGroup: 5 })

  return (
    <Card className="overflow-x-auto">
      <CardContent className="pl-0">
        <table className="border-separate border-spacing-2">
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
                <th className="sticky left-0 bg-background px-2 align-text-top capitalize md:px-3">
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
      </CardContent>
    </Card>
  )
}
