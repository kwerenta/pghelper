import { TimetableEntry } from "@/lib/api/queries/timeslots"
import { weekdayMap } from "@/lib/utils"

type TimeslotProps = {
  entry: TimetableEntry
  firstSubjectHour: number
  shouldShowTime?: boolean
}

export function Timeslot({
  entry,
  firstSubjectHour,
  shouldShowTime,
}: TimeslotProps) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-lg bg-muted p-2 md:p-3"
      style={{
        gridRow: `${entry.startTime - firstSubjectHour + 2} / ${entry.endTime - firstSubjectHour + 2}`,
        gridColumn: `${weekdayMap[entry.weekday]} / ${weekdayMap[entry.weekday] + 1}`,
      }}
    >
      <span>[{entry.course.type}]</span>
      <p>{entry.course.name}</p>
      {shouldShowTime && (
        <span>
          {entry.startTime}:00 - {entry.endTime}:00
        </span>
      )}
      <span className="text-sm">
        {entry.startDate
          ? `from ${entry.startDate.toLocaleDateString()}`
          : null}
        {entry.endDate ? `to ${entry.endDate.toLocaleDateString()}` : null}
      </span>
    </div>
  )
}
