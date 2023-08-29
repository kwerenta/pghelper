import Link from "next/link"
import { notFound } from "next/navigation"

import { buttonVariants } from "@/components/ui/Button"
import { DashboardHeader } from "@/components/DashboardHeader"
import { DashboardShell } from "@/components/DashboardShell"
import { QuizForm } from "@/app/(dashboard)/quiz/[quizId]/attempt/_components/QuizForm"

import { getQuiz } from "../loaders"

type QuizAttemptPageProps = {
  params: { quizId: string }
}

export default async function QuizAttemptPage({
  params,
}: QuizAttemptPageProps) {
  const quiz = await getQuiz(params.quizId)

  if (!quiz) return notFound()

  return (
    <DashboardShell>
      <DashboardHeader
        title={quiz.title}
        description={quiz.course.name}
        capitalizeDescription
      >
        <Link href="/quiz" className={buttonVariants()}>
          Cancel
        </Link>
      </DashboardHeader>
      <QuizForm questions={quiz.questions} />
    </DashboardShell>
  )
}
