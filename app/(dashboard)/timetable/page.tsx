import { redirect } from "next/navigation"

import {
  getDeanGroups,
  getTimeslotsByCourses,
  getUserTimetable,
} from "@/lib/api/timeslots/queries"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/DashboardHeader"
import { DashboardShell } from "@/components/DashboardShell"
import { Timetable } from "@/app/(dashboard)/timetable/_components/Timetable"
import { TimetableEditor } from "@/app/(dashboard)/timetable/_components/TimetableEditor"

import { SelectDeanGroupTimetable } from "./_components/SelectDeanGroupTimetable"

export default async function UserTimetablePage() {
  const user = await getCurrentUser()
  if (!user) return redirect("/")

  const entries = await getUserTimetable()

  const deanGroups = await getDeanGroups()

  const modifiableEntries = entries.filter(
    (entry, index, arr) =>
      entry.deanGroup !== 0 && arr.indexOf(entry) === index,
  )
  const timeslots = await getTimeslotsByCourses(
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
