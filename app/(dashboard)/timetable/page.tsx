import { redirect } from "next/navigation"
import { DeanGroup, DeanGroupId, Timeslot } from "@/db/schema"

import { getDeanGroupsBySemester } from "@/lib/api/queries/deanGroup"
import {
  TimetableEntry,
  getTimeslotsBySemesterWithDeanGroup,
  getUserTimetable,
} from "@/lib/api/queries/timeslots"
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

  const deanGroups = await getDeanGroupsBySemester(user.deanGroup.semesterId)
  const modifiableEntries = entries.filter(
    (entry) => entry.deanGroupId !== null,
  ) as Array<TimetableEntry & { deanGroupId: DeanGroupId }>

  const timeslots = (
    await getTimeslotsBySemesterWithDeanGroup(user.deanGroup.semesterId)
  ).filter((timeslot) => timeslot.deanGroupId !== null) as Array<
    Timeslot & { deanGroupId: DeanGroupId; deanGroup: DeanGroup }
  >

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
