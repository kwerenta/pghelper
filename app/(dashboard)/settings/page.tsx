import { redirect } from "next/navigation"

import { getDeanGroupsBySemester } from "@/lib/api/queries/deanGroup"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/DashboardHeader"
import { DashboardShell } from "@/components/DashboardShell"

import { DeanGroupForm } from "./_components/DeanGroupForm"

export default async function SettingsPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/")

  const deanGroups = await getDeanGroupsBySemester(user.deanGroup.semesterId)

  return (
    <DashboardShell>
      <DashboardHeader
        title="Settings"
        description="Edit your account settings."
      />
      <DeanGroupForm
        userDeanGroupId={user.deanGroup.id}
        deanGroups={deanGroups}
      />
    </DashboardShell>
  )
}
