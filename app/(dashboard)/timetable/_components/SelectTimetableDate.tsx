"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { endOfISOWeek, format, isSameISOWeek, startOfISOWeek } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"
import type { DeepRequired } from "react-hook-form"

import { Button } from "@/components/ui/Button"
import { Calendar } from "@/components/ui/Calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover"

type SelectTimetableDateProps = {
  week: Date
}

export function SelectTimetableDate({ week }: SelectTimetableDateProps) {
  const router = useRouter()
  const pathname = usePathname()

  const weekRange: DeepRequired<DateRange> = {
    from: week,
    to: endOfISOWeek(week),
  }

  const getNewSearchParams = (newDate: Date) =>
    new URLSearchParams({
      date: format(newDate, "yyyy-MM-dd"),
    }).toString()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[280px] justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 size-4" />
          {format(weekRange.from, "PP")} - {format(weekRange.to, "PP")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          ISOWeek
          mode="range"
          selected={weekRange}
          defaultMonth={week}
          onDayClick={(newDate) =>
            isSameISOWeek(newDate, week)
              ? router.push(pathname)
              : router.push(
                  pathname + "?" + getNewSearchParams(startOfISOWeek(newDate)),
                )
          }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
