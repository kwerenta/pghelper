import Link from "next/link"

import { buttonVariants } from "@/components/ui/Button"
import { DashboardHeader } from "@/components/DashboardHeader"
import { DashboardShell } from "@/components/DashboardShell"
import { QuizCreator } from "@/app/(dashboard)/quiz/new/_components/QuizCreator"

import { getCoursesList } from "./loaders"

export default async function NewQuizPage() {
  const coursesList = await getCoursesList()

  return (
    <DashboardShell>
      <DashboardHeader title="Quiz creator" description="Create new quiz.">
        <Link href="/quiz" className={buttonVariants()}>
          Go back
        </Link>
      </DashboardHeader>
      <QuizCreator courses={coursesList} />
    </DashboardShell>
  )
}
