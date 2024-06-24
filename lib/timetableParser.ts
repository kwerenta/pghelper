import { TimeslotException, timeslots } from "@/db/schema"
import {
  addDays,
  differenceInCalendarWeeks,
  getDay,
  isAfter,
  isBefore,
  isSameISOWeek,
} from "date-fns"

import type { TimetableEntry } from "./api/queries/timeslots"

export function parseTimetable(
  entries: TimetableEntry[],
  timeslotExceptions: TimeslotException[],
  week: Date | undefined,
) {
  const timetable: Record<TimetableEntry["weekday"], TimetableEntry[]> = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
  }

  entries
    .filter(
      (entry) =>
        !week ||
        (isTimeslotInWeek(entry, week) &&
          !hasTimeslotException(entry, timeslotExceptions, week)),
    )
    .forEach((entry) => {
      if (
        entry.course.frequency === "every_two_weeks" &&
        week &&
        entry.startDate &&
        differenceInCalendarWeeks(week, entry.startDate) % 2 !== 0
      )
        return

      timetable[entry.weekday].push(entry)
    })

  timeslotExceptions.forEach((exception) => {
    if (exception.action !== "reschedule") return
    if (!week || !isSameISOWeek(week, exception.date)) return
    if (
      exception.startTime === null ||
      exception.endTime === null ||
      exception.newDate === null
    )
      return

    const entry = entries.find((e) => e.id === exception.timeslotId)
    if (!entry) return

    const weekday = timeslots.weekday.enumValues[getDay(exception.newDate) - 1]

    timetable[weekday].push({
      ...entry,
      startTime: exception.startTime,
      endTime: exception.endTime,
      weekday,
    })
  })

  return timetable
}

function isTimeslotInWeek(timeslot: TimetableEntry, week: Date) {
  return !(
    (timeslot.endDate && isAfter(week, timeslot.endDate)) ||
    (timeslot.startDate && isBefore(addDays(week, 7), timeslot.startDate))
  )
}

function hasTimeslotException(
  timeslot: TimetableEntry,
  exceptions: TimeslotException[],
  week: Date,
) {
  return exceptions.some(
    (exception) =>
      exception.timeslotId === timeslot.id &&
      isSameISOWeek(week, exception.date),
  )
}
