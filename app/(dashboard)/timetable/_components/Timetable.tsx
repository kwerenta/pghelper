import { timeslots } from "@/db/schema"

import { type TimetableEntry } from "@/lib/api/queries/timeslots"
import { Card, CardContent } from "@/components/ui/Card"
import { Timeslot } from "@/app/(dashboard)/timetable/_components/Timeslot"

type TimetableProps = {
  entries: Record<TimetableEntry["weekday"], TimetableEntry[]>
}

export const Timetable = ({ entries }: TimetableProps) => {
  const hours = timeslots.weekday.enumValues.flatMap((day) =>
    entries[day].map((entry) => ({
      startTime: entry.startTime,
      endTime: entry.endTime,
    })),
  )
  const firstSubjectHour = Math.min(...hours.map((hour) => hour.startTime))
  const lastSubjectHour = Math.max(...hours.map((hour) => hour.endTime))
  const dayLength = lastSubjectHour - firstSubjectHour + 1

  const hoursArray = Array.from(
    { length: dayLength },
    (_, i) => i + firstSubjectHour,
  )

  return (
    <Card>
      <CardContent className="pl-2 pr-4">
        <div className="grid w-full grid-cols-[auto,repeat(5,1fr)] grid-rows-1 gap-4 overflow-x-auto text-center">
          <div
            className="sticky left-0 grid grid-cols-[auto] gap-2 bg-background text-center"
            style={{
              gridTemplateRows: `auto repeat(${dayLength - 1}, 1fr) auto`,
            }}
          >
            <div className="py-3 font-bold">Hour</div>
            {hoursArray.map((hour, index) => (
              <div
                key={hour}
                className="px-2 capitalize leading-none md:px-4 [&:not(:last-child)]:translate-y-[-0.75ch]"
                style={{ gridRow: `${index + 2} / ${index + 3}` }}
              >
                {hour}:00
              </div>
            ))}
          </div>

          {timeslots.weekday.enumValues.map((day, dayIndex) => (
            <div
              key={dayIndex}
              className="grid grid-cols-[minmax(10rem,1fr)] gap-2"
              style={{
                gridTemplateRows: `auto repeat(${dayLength - 1}, 1fr) auto`,
              }}
            >
              <div className="py-3 font-bold capitalize">{day}</div>
              {entries[day].map((entry) => (
                <Timeslot
                  key={entry.id}
                  entry={entry}
                  firstSubjectHour={firstSubjectHour}
                />
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
