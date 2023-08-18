import Link from "next/link"

import { buttonVariants } from "@/components/ui/Button"
import { DashboardHeader } from "@/components/DashboardHeader"
import { DashboardShell } from "@/components/DashboardShell"
import { QuizCreator } from "@/components/QuizCreator"

export default function NewQuizPage() {
  return (
    <DashboardShell>
      <DashboardHeader title="Quiz creator" description="Create new quiz.">
        <Link href="/quiz" className={buttonVariants()}>
          Go back
        </Link>
      </DashboardHeader>
      <QuizCreator />
    </DashboardShell>
  )
}
