import Link from "next/link"
import { notFound } from "next/navigation"

import { shuffleArray } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/Button"
import { DashboardHeader } from "@/components/DashboardHeader"
import { DashboardShell } from "@/components/DashboardShell"
import { ExamForm } from "@/app/(dashboard)/exams/[examId]/attempt/_components/ExamForm"

import { getExam } from "../loaders"

type ExamAttemptPageProps = {
  params: { examId: string }
}

export default async function ExamAttemptPage({
  params,
}: ExamAttemptPageProps) {
  const exam = await getExam(params.examId)

  if (!exam) return notFound()

  const shuffledQuestions = exam.questions.map((question) => ({
    ...question,
    answers: shuffleArray(question.answers),
  }))

  return (
    <DashboardShell>
      <DashboardHeader
        title={exam.title}
        description={exam.course.name}
        capitalizeDescription
      >
        <Link href="/exams" className={buttonVariants()}>
          Cancel
        </Link>
      </DashboardHeader>
      <ExamForm questions={shuffledQuestions} />
    </DashboardShell>
  )
}
