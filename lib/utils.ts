import { Timeslot, TimeslotException, timeslots } from "@/db/schema"
import { clsx, type ClassValue } from "clsx"
import { addDays, getDay, isAfter, isBefore, isSameISOWeek } from "date-fns"
import { toast } from "sonner"
import { twMerge } from "tailwind-merge"

import { ActionResult } from "./actionValidator"
import { TimetableEntry } from "./api/queries/timeslots"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function actionToast(result: ActionResult<unknown>) {
  if (result.success) {
    toast.success("Success", { description: result.message })
    return
  }
  toast.error("Error", { description: result.message })
}

const relativeTimeFormatter = new Intl.RelativeTimeFormat(undefined, {
  numeric: "auto",
})

const DIVISIONS = [
  { amount: 60, name: "seconds" },
  { amount: 60, name: "minutes" },
  { amount: 24, name: "hours" },
  { amount: 7, name: "days" },
  { amount: 4.34524, name: "weeks" },
  { amount: 12, name: "months" },
  { amount: Number.POSITIVE_INFINITY, name: "years" },
] as const

export function formatTimeAgo(date: Date) {
  let duration = (date.valueOf() - new Date().valueOf()) / 1000
  for (let i = 0; i < DIVISIONS.length; i++) {
    const division = DIVISIONS[i]
    if (Math.abs(duration) < division.amount)
      return relativeTimeFormatter.format(Math.round(duration), division.name)

    duration /= division.amount
  }
}

export function shuffleArray<T>(arr: T[]) {
  // Fisher-Yates shuffle
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }

  return arr
}

export function parseTimetable(
  entries: TimetableEntry[],
  timeslotExceptions: TimeslotException[],
  week: Date | undefined,
) {
  const timetable: Record<Timeslot["weekday"], TimetableEntry[]> = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
  }

  entries
    .filter(
      (entry) =>
        !(
          week &&
          ((entry.endDate && isAfter(addDays(week, 7), entry.endDate)) ||
            (entry.startDate && isBefore(week, entry.startDate)))
        ),
    )
    .filter(
      (entry) =>
        timeslotExceptions.findIndex(
          (e) =>
            week && entry.id === e.timeslotId && isSameISOWeek(week, e.date),
        ) === -1,
    )
    .forEach((entry) => {
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
