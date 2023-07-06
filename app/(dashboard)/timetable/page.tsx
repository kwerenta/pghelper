import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/session"
import { getUserTimetable } from "@/lib/timetable"
import { DashboardHeader } from "@/components/DashboardHeader"
import { DashboardShell } from "@/components/DashboardShell"
import { Timetable } from "@/components/Timetable"
import { TimetableEditor } from "@/components/TimetableEditor"

export default async function TimetablePage() {
  const user = await getCurrentUser()
  if (!user) return redirect("/")

  const entries = await getUserTimetable({
    id: user.id,
    deanGroup: user.deanGroup,
  })

  const modifiableEntries = entries.filter(
    (entry, index, arr) => entry.deanGroup !== 0 && arr.indexOf(entry) === index
  )

  return (
    <DashboardShell>
      <DashboardHeader
        title="Timetable"
        description="View and customise your timetable."
      >
        <TimetableEditor timetableEntries={modifiableEntries} />
      </DashboardHeader>
      <Timetable entries={entries} />
    </DashboardShell>
  )
}
