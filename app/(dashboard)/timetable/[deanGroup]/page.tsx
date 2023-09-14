import Link from "next/link"
import { redirect } from "next/navigation"
import { z } from "zod"

import { buttonVariants } from "@/components/ui/Button"
import { DashboardHeader } from "@/components/DashboardHeader"
import { DashboardShell } from "@/components/DashboardShell"

import { SelectDeanGroupTimetable } from "../_components/SelectDeanGroupTimetable"
import { Timetable } from "../_components/Timetable"
import { getDeanGroups } from "../loaders"
import { getDeanGroupTimetable } from "./loaders"

type TimetablePageProps = {
  params: { deanGroup: string }
}

const timetablePageParamsSchema = z.object({
  deanGroup: z.coerce.number().positive(),
})

export default async function TimetablePage({ params }: TimetablePageProps) {
  const parsedParams = timetablePageParamsSchema.safeParse(params)
  if (!parsedParams.success) redirect("/timetable")
  const { deanGroup } = parsedParams.data

  const deanGroups = await getDeanGroups()
  if (!deanGroups.includes(deanGroup)) redirect("/timetable")

  const entries = await getDeanGroupTimetable(deanGroup)

  return (
    <DashboardShell>
      <DashboardHeader
        title="Timetable"
        description="View other groups timetable."
      >
        <div className="flex flex-row gap-4">
          <SelectDeanGroupTimetable
            deanGroups={deanGroups}
            deanGroup={deanGroup}
          />
          <Link href="/timetable" className={buttonVariants()}>
            Go to your timetable
          </Link>
        </div>
      </DashboardHeader>
      <Timetable entries={entries} />
    </DashboardShell>
  )
}
