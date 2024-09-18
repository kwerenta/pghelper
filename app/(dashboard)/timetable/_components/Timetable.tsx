import { timeslots } from "@/db/schema"

import { type TimetableEntry } from "@/lib/api/queries/timeslots"
import { Card, CardContent } from "@/components/ui/Card"
import { Timeslot } from "@/app/(dashboard)/timetable/_components/Timeslot"

import { StackedTimeslots } from "./StackedTimeslots"

type TimetableProps = {
  entries: TimetableEntry[]
}

export const Timetable = ({ entries }: TimetableProps) => {
  const hours = entries.map((entry) => ({
    startTime: entry.startTime,
    endTime: entry.endTime,
  }))

  const firstSubjectHour = Math.min(...hours.map((hour) => hour.startTime))
  const lastSubjectHour = Math.max(...hours.map((hour) => hour.endTime))
  const dayLength = lastSubjectHour - firstSubjectHour + 1

  const hoursArray = Array.from(
    { length: dayLength },
    (_, i) => i + firstSubjectHour,
  )

  const [singleEntries, multiEntries] = entries.reduce<
    [TimetableEntry[], TimetableEntry[][]]
  >(
    (result, entry) => {
      const overlappingEntries = entries.filter(
        (e) =>
          entry.id !== e.id &&
          entry.weekday === e.weekday &&
          entry.startTime < e.endTime &&
          e.startTime < entry.endTime,
      )

      if (overlappingEntries.length === 0) {
        result[0].push(entry)
        return result
      }

      if (!result[1].some((entries) => entries.some((e) => entry.id === e.id)))
        result[1].push([entry, ...overlappingEntries])
      return result
    },
    [[], []],
  )

  return (
    <Card>
      <CardContent className="pl-2 pr-4">
        <div
          className="grid w-full grid-cols-[auto_repeat(5,minmax(10rem,1fr))] gap-x-4 gap-y-2 overflow-x-auto text-center"
          style={{
            gridTemplateRows: `auto repeat(${dayLength - 1}, 1fr) 1.5rem`,
          }}
        >
          <div className="sticky left-0 col-[1/2] row-[1/2] bg-background py-3 font-bold after:absolute after:inset-x-0 after:top-full after:h-2 after:bg-background">
            Hour
          </div>
          {hoursArray.map((hour, index) => (
            <div
              key={hour}
              className="sticky left-0 col-[1/2] translate-y-[-0.5em] bg-background px-2 capitalize leading-none after:absolute after:inset-x-0 after:top-full after:h-2 after:bg-background md:px-4"
              style={{ gridRow: `${index + 2} / ${index + 3}` }}
            >
              {hour}:00
            </div>
          ))}

          {timeslots.weekday.enumValues.map((day, dayIndex) => (
            <div key={dayIndex} className="row-[1/2] py-3 font-bold capitalize">
              {day}
            </div>
          ))}

          {singleEntries.map((entry) => (
            <Timeslot
              key={entry.id}
              entry={entry}
              firstSubjectHour={firstSubjectHour}
            />
          ))}

          {multiEntries.map((entries) => (
            <StackedTimeslots
              key={entries[0].id}
              entries={entries}
              firstSubjectHour={firstSubjectHour}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
