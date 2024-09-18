import { clsx, type ClassValue } from "clsx"
import { toast } from "sonner"
import { twMerge } from "tailwind-merge"

import { ActionResult } from "./actionValidator"
import type { TimetableEntry } from "./api/queries/timeslots"

export const weekdayMap: Record<TimetableEntry["weekday"], number> = {
  monday: 2,
  tuesday: 3,
  wednesday: 4,
  thursday: 5,
  friday: 6,
}

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
