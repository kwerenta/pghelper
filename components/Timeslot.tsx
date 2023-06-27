import { Course } from "@/db/schema"

export function Timeslot({ course }: { course?: Course }) {
  return (
    <td className="min-w-[16rem] border-l-2 border-l-muted-foreground p-2 capitalize sm:px-3 md:min-w-[12rem] lg:min-w-0 lg:px-4">
      {!course ? null : (
        <>
          <span>[{course.type}]</span>
          <p>{course.name}</p>
        </>
      )}
    </td>
  )
}
