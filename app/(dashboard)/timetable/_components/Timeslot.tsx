import { Course } from "@/db/schema"

type TimeslotProps = {
  course?: Course
}

export function Timeslot({ course }: TimeslotProps) {
  return (
    <td className="min-w-48 rounded-lg bg-muted p-2 capitalize md:p-3">
      {!course ? null : (
        <>
          <span>[{course.type}]</span>
          <p>{course.name}</p>
        </>
      )}
    </td>
  )
}
