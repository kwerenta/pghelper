import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/DashboardHeader"
import { DashboardShell } from "@/components/DashboardShell"
import { Timetable } from "@/app/(dashboard)/timetable/_components/Timetable"
import { TimetableEditor } from "@/app/(dashboard)/timetable/_components/TimetableEditor"

import { SelectDeanGroupTimetable } from "./_components/SelectDeanGroupTimetable"
import { getCoursesTimeslots, getDeanGroups, getUserTimetable } from "./loaders"

export default async function UserTimetablePage() {
  const user = await getCurrentUser()
  if (!user) return redirect("/")

  const entries = await getUserTimetable({
    id: user.id,
    deanGroup: user.deanGroup,
  })

  const deanGroups = await getDeanGroups()

  const modifiableEntries = entries.filter(
    (entry, index, arr) =>
      entry.deanGroup !== 0 && arr.indexOf(entry) === index,
  )
  const timeslots = await getCoursesTimeslots(
    modifiableEntries.map((e) => e.course.id),
  )

  return (
    <DashboardShell>
      <DashboardHeader
        title="Timetable"
        description="View and customise your timetable."
      >
        <div className="flex flex-row gap-4">
          <SelectDeanGroupTimetable deanGroups={deanGroups} />
          <TimetableEditor
            timetableEntries={modifiableEntries}
            timeslots={timeslots}
          />
        </div>
      </DashboardHeader>
      <Timetable entries={entries} />
    </DashboardShell>
  )
}
