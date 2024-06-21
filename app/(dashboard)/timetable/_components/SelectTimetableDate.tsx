"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Calendar } from "@/components/ui/Calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover"

type SelectTimetableDateProps = {
  date: Date | undefined
}

export function SelectTimetableDate({ date }: SelectTimetableDateProps) {
  const router = useRouter()
  const pathname = usePathname()

  const getNewSearchParams = (newDate: Date) =>
    new URLSearchParams({
      date: format(newDate, "yyyy-MM-dd"),
    }).toString()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 size-4" />
          {date ? format(date, "PPP") : <span>Generalized timetable</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          ISOWeek
          mode="single"
          selected={date}
          onSelect={(newDate) =>
            newDate
              ? router.push(pathname + "?" + getNewSearchParams(newDate))
              : router.push(pathname)
          }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
