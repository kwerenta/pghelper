import Link from "next/link"
import { notFound } from "next/navigation"

import { buttonVariants } from "@/components/ui/Button"
import { DashboardHeader } from "@/components/DashboardHeader"
import { DashboardShell } from "@/components/DashboardShell"
import { QuizForm } from "@/app/(dashboard)/quiz/[quizId]/_components/QuizForm"

import { getQuiz } from "./loaders"

type QuizPageProps = {
  params: { quizId: string }
}

export default async function Quiz({ params }: QuizPageProps) {
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
