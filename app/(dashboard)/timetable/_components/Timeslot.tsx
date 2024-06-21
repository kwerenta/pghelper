import { Course, TimeslotException } from "@/db/schema"

import { cn } from "@/lib/utils"

type TimeslotProps = {
  course?: Course
  startDate?: Date | null
  endDate?: Date | null
  exception?: TimeslotException
}

export function Timeslot({
  course,
  startDate,
  endDate,
  exception,
}: TimeslotProps) {
  return (
    <td className="min-w-48 rounded-lg bg-muted p-2 md:p-3">
      {!course ? null : (
        <>
          <span>[{course.type}]</span>
          <p className={cn(exception?.action === "cancel" && "line-through")}>
            {course.name}
          </p>
          <span className="text-sm">
            {startDate ? `from ${startDate.toLocaleDateString()}` : null}
            {endDate ? `to ${endDate.toLocaleDateString()}` : null}
            {exception ? exception.action : null}
          </span>
        </>
      )}
    </td>
  )
}
