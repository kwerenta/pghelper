import { timeslots } from "@/db/schema"

import { type TimetableEntry } from "@/lib/api/timeslots/queries"
import { Card, CardContent } from "@/components/ui/Card"
import { Timeslot } from "@/app/(dashboard)/timetable/_components/Timeslot"

const FIRST_SUBJECT_HOUR = 7
const LAST_SUBJECT_HOUR = 21

const hoursArray = Array.from(
  { length: LAST_SUBJECT_HOUR - FIRST_SUBJECT_HOUR + 1 },
  (_, i) => i + FIRST_SUBJECT_HOUR,
)

type TimetableProps = {
  entries: TimetableEntry[]
}

export const Timetable = ({ entries }: TimetableProps) => (
  <Card className="overflow-x-auto">
    <CardContent className="pl-0">
      <table className="border-separate border-spacing-2">
        <thead>
          <tr>
            <th className="sticky left-0 bg-background py-2">Hour</th>
            {timeslots.weekday.enumValues.map((day, i) => (
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
              {timeslots.weekday.enumValues.map((weekday) => {
                const course = entries.find(
                  (entry) =>
                    entry.weekday === weekday &&
                    entry.startTime <= hour &&
                    entry.endTime > hour,
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
