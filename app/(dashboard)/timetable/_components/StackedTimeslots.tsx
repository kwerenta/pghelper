import { CircleEllipsis } from "lucide-react"

import { TimetableEntry } from "@/lib/api/queries/timeslots"
import { weekdayMap } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover"

import { Timeslot } from "./Timeslot"

type StackedTimeslotsProps = {
  entries: TimetableEntry[]
  firstSubjectHour: number
}

export function StackedTimeslots({
  entries,
  firstSubjectHour,
}: StackedTimeslotsProps) {
  const startTime = Math.min(...entries.map((entry) => entry.startTime))
  const endTime = Math.max(...entries.map((entry) => entry.endTime))
  const weekday = entries[0].weekday

  return (
    <Popover>
      <PopoverTrigger
        className="relative rounded-lg bg-muted"
        style={{
          gridRow: `${startTime - firstSubjectHour + 2} / ${endTime - firstSubjectHour + 2}`,
          gridColumn: `${weekdayMap[weekday]} / ${weekdayMap[weekday] + 1}`,
        }}
      >
        <div className="absolute right-2 top-2 md:right-3 md:top-3">
          <CircleEllipsis className="size-5" />
          <span className="sr-only">Show all timeslots in this block</span>
        </div>
        <Timeslot
          entry={entries[0]}
          firstSubjectHour={firstSubjectHour}
          shouldShowTime={
            entries[0].startTime !== startTime || entries[0].endTime !== endTime
          }
        />
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-2">
        {entries.map((entry) => (
          <Timeslot
            key={entry.id}
            entry={entry}
            firstSubjectHour={firstSubjectHour}
            shouldShowTime
          />
        ))}
      </PopoverContent>
    </Popover>
  )
}
