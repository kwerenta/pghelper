import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/DashboardHeader"
import { DashboardShell } from "@/components/DashboardShell"

import { getDeanGroups } from "../timetable/loaders"
import { DeanGroupForm } from "./_components/DeanGroupForm"

export default async function SettingsPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/")

  const deanGroups = await getDeanGroups()

  return (
    <DashboardShell>
      <DashboardHeader
        title="Settings"
        description="Edit your account settings."
      />
      <DeanGroupForm userDeanGroup={user.deanGroup} deanGroups={deanGroups} />
    </DashboardShell>
  )
}
