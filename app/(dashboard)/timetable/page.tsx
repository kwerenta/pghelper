import { Button } from "@/components/ui/Button"
import { DashboardHeader } from "@/components/DashboardHeader"
import { DashboardShell } from "@/components/DashboardShell"
import { Icons } from "@/components/Icons"
import { Timetable } from "@/components/Timetable"

export default async function TimetablePage() {
  return (
    <DashboardShell>
      <DashboardHeader
        title="Timetable"
        description="View and customise your timetable."
      >
        <Button variant="default">
          <Icons.edit className="mr-2 h-4 w-4" />
          Edit timetable
        </Button>
      </DashboardHeader>
      <Timetable />
    </DashboardShell>
  )
}
