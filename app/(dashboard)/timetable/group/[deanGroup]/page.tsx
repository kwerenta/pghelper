import Link from "next/link"
import { redirect } from "next/navigation"

import { getDeanGroupsBySemester } from "@/lib/api/queries/deanGroup"
import { getTimeslotsByDeanGroup } from "@/lib/api/queries/timeslots"
import { getCurrentUser } from "@/lib/session"
import { parseTimetable } from "@/lib/timetableParser"
import { deanGroupSchema } from "@/lib/validators/deanGroup"
import { buttonVariants } from "@/components/ui/Button"
import { DashboardHeader } from "@/components/DashboardHeader"
import { DashboardShell } from "@/components/DashboardShell"

import { SelectDeanGroupTimetable } from "../../_components/SelectDeanGroupTimetable"
import { Timetable } from "../../_components/Timetable"

type TimetablePageProps = {
  params: { deanGroup: string }
}

export default async function TimetablePage({ params }: TimetablePageProps) {
  const user = await getCurrentUser()
  if (!user) return redirect("/")

  const parsedParams = deanGroupSchema.safeParse(params)
  if (!parsedParams.success) redirect("/timetable")
  const { deanGroup } = parsedParams.data

  const deanGroups = await getDeanGroupsBySemester(user.deanGroup.semesterId)
  if (!deanGroups.map((group) => group.id).includes(deanGroup))
    redirect("/timetable")

  const entries = await getTimeslotsByDeanGroup(deanGroup)

  const timetable = parseTimetable(entries, [], undefined)

  return (
    <DashboardShell>
      <DashboardHeader
        title="Timetable"
        description="View other groups timetable."
      >
        <div className="flex flex-row gap-4">
          <SelectDeanGroupTimetable
            deanGroups={deanGroups}
            currentDeanGroup={deanGroup}
          />
          <Link href="/timetable" className={buttonVariants()}>
            Go to your timetable
          </Link>
        </div>
      </DashboardHeader>
      <Timetable entries={timetable} />
    </DashboardShell>
  )
}
