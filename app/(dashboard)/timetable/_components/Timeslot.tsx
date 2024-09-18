import { TimetableEntry } from "@/lib/api/queries/timeslots"

type TimeslotProps = {
  entry: TimetableEntry
  firstSubjectHour: number
}

const weekdayMap: Record<TimetableEntry["weekday"], number> = {
  monday: 2,
  tuesday: 3,
  wednesday: 4,
  thursday: 5,
  friday: 6,
}

export function Timeslot({ entry, firstSubjectHour }: TimeslotProps) {
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
      <span className="text-sm">
        {entry.startDate
          ? `from ${entry.startDate.toLocaleDateString()}`
          : null}
        {entry.endDate ? `to ${entry.endDate.toLocaleDateString()}` : null}
      </span>
    </div>
  )
}
