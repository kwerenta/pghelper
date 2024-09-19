"use client"

import type { Semester } from "@/db/schema"
import {
  addDays,
  addWeeks,
  format,
  isBefore,
  isSameDay,
  startOfISOWeek,
} from "date-fns"
import { createEvents, type EventAttributes } from "ics"

import { TimetableEntry } from "@/lib/api/queries/timeslots"
import { Button } from "@/components/ui/Button"

type AddToCalendarButtonProps = {
  entries: TimetableEntry[]
  semester: Semester
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

export function AddToCalendarButton({
  entries,
  semester,
}: AddToCalendarButtonProps) {
  const semesterFirstWeek = startOfISOWeek(semester.startDate)

  const calendarEvents = entries.map<EventAttributes>((entry) => {
    let day =
      entry.startDate || addDays(semesterFirstWeek, weekdayMap[entry.weekday])
    if (
      !isSameDay(day, semester.startDate) &&
      isBefore(day, semester.startDate)
    )
      day = addWeeks(day, 1)

    const interval = entry.course.frequency === "every_two_weeks" ? "2" : "1"
    const until = `${format(addDays(entry.endDate || semester.endDate, 1), "yyyMMdd")}T000000Z`

    return {
      title: `[${courseTypeMap[entry.course.type]}] ${entry.course.name}`,
      startInputType: "local",
      start: [
        day.getFullYear(),
        day.getMonth() + 1,
        day.getDate(),
        entry.startTime,
        0,
      ],
      end: [
        day.getFullYear(),
        day.getMonth() + 1,
        day.getDate(),
        entry.endTime,
        0,
      ],
      recurrenceRule: `FREQ=WEEKLY;INTERVAL=${interval};UNTIL=${until}`,
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
