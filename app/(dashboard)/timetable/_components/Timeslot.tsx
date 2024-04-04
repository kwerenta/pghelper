import { Course } from "@/db/schema"

type TimeslotProps = {
  course?: Course
  startDate?: Date | null
  endDate?: Date | null
}

export function Timeslot({ course, startDate, endDate }: TimeslotProps) {
  return (
    <td className="min-w-48 rounded-lg bg-muted p-2 capitalize md:p-3">
      {!course ? null : (
        <>
          <span>[{course.type}]</span>
          <p>{course.name}</p>
          <span className="text-sm">
            {startDate ? `from ${startDate.toLocaleDateString()}` : null}
            {endDate ? `to ${endDate.toLocaleDateString()}` : null}
          </span>
        </>
      )}
    </td>
  )
}
