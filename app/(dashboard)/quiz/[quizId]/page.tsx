import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { quizzes } from "@/db/schema"
import { eq } from "drizzle-orm"

import { buttonVariants } from "@/components/ui/Button"
import { DashboardHeader } from "@/components/DashboardHeader"
import { DashboardShell } from "@/components/DashboardShell"
import { QuizForm } from "@/components/QuizForm"

export default async function Quiz({ params }: { params: { quizId: string } }) {
  const quiz = await db.query.quizzes.findFirst({
    where: eq(quizzes.id, params.quizId),
    with: {
      questions: {
        with: { answers: true },
      },
    },
  })

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
