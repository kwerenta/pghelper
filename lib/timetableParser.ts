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

  const isTimeslotInCurrentWeek = (entry: TimetableEntry) =>
    !week ||
    (isTimeslotInWeek(entry, week) &&
      !hasTimeslotException(entry, timeslotExceptions, week))

  const shouldIncludeEntry = (entry: TimetableEntry) =>
    entry.course.frequency !== "every_two_weeks" ||
    !week ||
    !entry.startDate ||
    differenceInCalendarWeeks(week, entry.startDate) % 2 === 0

  entries.filter(isTimeslotInCurrentWeek).forEach((entry) => {
    if (shouldIncludeEntry(entry)) timetable[entry.weekday].push(entry)
  })

  if (!week) return timetable

  const groupedExceptions = groupExceptionsByTimeslotId(timeslotExceptions)

  for (const [timeslotId, exceptions] of Object.entries(groupedExceptions)) {
    const entry = entries.find((e) => e.id.toString() === timeslotId)
    if (!entry) continue

    const updatedEntry = applyExceptionsToEntry(entry, exceptions, week)
    if (updatedEntry) timetable[updatedEntry.weekday].push(updatedEntry)
  }

  return timetable
}

function applyExceptionsToEntry(
  entry: TimetableEntry,
  exceptions: TimeslotException[],
  week: Date,
) {
  return exceptions
    .sort(compareExceptions)
    .reduce<null | TimetableEntry>((result, exception) => {
      if (exception.action === "cancel" && isSameISOWeek(week, exception.date))
        return null

      if (
        exception.startTime === null ||
        exception.endTime === null ||
        exception.newDate === null
      )
        return result

      if (
        exception.action === "reschedule" &&
        isSameISOWeek(week, exception.newDate)
      ) {
        return {
          ...entry,
          startTime: exception.startTime,
          endTime: exception.endTime,
          weekday: timeslots.weekday.enumValues[getDay(exception.newDate) - 1],
        }
      }

      return result
    }, null)
}

function groupExceptionsByTimeslotId(exceptions: TimeslotException[]) {
  return exceptions.reduce<Record<number, TimeslotException[]>>(
    (grouped, exception) => (
      (grouped[exception.timeslotId] ||= []).push(exception), grouped
    ),
    {},
  )
}

// Sort by date ascending then by action type
// so that reschedules come before cancels
function compareExceptions(a: TimeslotException, b: TimeslotException) {
  if (a.date < b.date) return -1
  if (a.date > b.date) return 1
  if (a.action !== "cancel" && b.action === "cancel") return -1
  if (a.action === "cancel" && b.action !== "cancel") return 1
  return 0
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
