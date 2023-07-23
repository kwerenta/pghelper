import { Button } from "@/components/ui/Button"
import { DashboardHeader } from "@/components/DashboardHeader"
import { DashboardShell } from "@/components/DashboardShell"
import { Icons } from "@/components/Icons"

export default function QuizPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        title="Quiz"
        description="View all available quizzes for you."
      >
        <Button variant="default">
          <Icons.plusCircle className="mr-2 h-4 w-4" />
          Add quiz
        </Button>
      </DashboardHeader>
      Quiz list
    </DashboardShell>
  )
}
