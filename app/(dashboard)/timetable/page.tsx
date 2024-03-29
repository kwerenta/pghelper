import { redirect } from "next/navigation"

import { getCoursesBySemester } from "@/lib/api/queries/courses"
import { getDeanGroupsBySemester } from "@/lib/api/queries/deanGroup"
import {
  getTimeslotsBySemester,
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
  const courses = (
    await getCoursesBySemester(user.deanGroup.semesterId)
  ).filter((course) => course.type !== "lecture")

  const timeslots = await getTimeslotsBySemester(user.deanGroup.semesterId)

  return (
    <DashboardShell>
      <DashboardHeader
        title="Timetable"
        description="View and customise your timetable."
      >
        <div className="flex flex-row gap-4">
          <SelectDeanGroupTimetable deanGroups={deanGroups} />
          <TimetableEditor
            currentTimetable={entries}
            courses={courses}
            timeslots={timeslots}
            deanGroups={deanGroups}
          />
        </div>
      </DashboardHeader>
      <Timetable entries={entries} />
    </DashboardShell>
  )
}
