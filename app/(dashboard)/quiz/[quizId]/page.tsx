import Link from "next/link"
import { notFound } from "next/navigation"

import { buttonVariants } from "@/components/ui/Button"
import { DashboardHeader } from "@/components/DashboardHeader"
import { DashboardShell } from "@/components/DashboardShell"
import { QuizForm } from "@/components/QuizForm"

import { getQuiz } from "./loaders"

export default async function Quiz({ params }: { params: { quizId: string } }) {
  const quiz = await getQuiz(params.quizId)

  if (!quiz) return notFound()

  return (
    <DashboardShell>
      <DashboardHeader
        title={quiz.title}
        description={quiz.description ?? "No description."}
      >
        <Link href="/quiz" className={buttonVariants()}>
          Go back
        </Link>
      </DashboardHeader>
      <QuizForm questions={quiz.questions} />
    </DashboardShell>
  )
}
