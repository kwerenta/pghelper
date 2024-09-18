"use client"

import { addDays, startOfISOWeek } from "date-fns"
import { createEvents, type EventAttributes } from "ics"

import { TimetableEntry } from "@/lib/api/queries/timeslots"
import { Button } from "@/components/ui/Button"

type AddToCalendarButtonProps = {
  entries: TimetableEntry[]
}

const weekdayMap: Record<TimetableEntry["weekday"], number> = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
}

const courseTypeMap: Record<TimetableEntry["course"]["type"], string> = {
  laboratory: "L",
  lecture: "W",
  project: "P",
  tutorial: "C",
}

export function AddToCalendarButton({ entries }: AddToCalendarButtonProps) {
  const weekStart = startOfISOWeek(new Date())

  const calendarEvents = entries.map<EventAttributes>((entry) => {
    const day = addDays(weekStart, weekdayMap[entry.weekday])

    return {
      title: `[${courseTypeMap[entry.course.type]}] ${entry.course.name}`,
      startInputType: "local",
      start: [
        day.getFullYear(),
        day.getMonth() + 1,
        day.getDay() + 1,
        entry.startTime,
        0,
      ],
      end: [
        day.getFullYear(),
        day.getMonth() + 1,
        day.getDay() + 1,
        entry.endTime,
        0,
      ],
      recurrenceRule: `FREQ=WEEKLY;INTERVAL=${entry.course.frequency === "every_two_weeks" ? "2" : "1"}`,
    }
  })

  const downloadCalendar = async () => {
    const filename = "Timetable.ics"
    const file = await new Promise<File>((resolve, reject) => {
      createEvents(calendarEvents, (error, value) => {
        if (error) {
          console.error(error)
          reject(error)
        }

        resolve(new File([value], filename, { type: "text/calendar" }))
      })
    })
    const url = URL.createObjectURL(file)

    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = filename

    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)

    URL.revokeObjectURL(url)
  }
  return (
    <Button onClick={async () => await downloadCalendar()}>
      Add to Calendar
    </Button>
  )
}
