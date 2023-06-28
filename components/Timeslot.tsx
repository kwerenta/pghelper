import { Course } from "@/db/schema"

export function Timeslot({ course }: { course?: Course }) {
  return (
    <td className="min-w-[12rem] rounded-lg bg-muted p-2 capitalize md:p-3">
      {!course ? null : (
        <>
          <span>[{course.type}]</span>
          <p>{course.name}</p>
        </>
      )}
    </td>
  )
}
