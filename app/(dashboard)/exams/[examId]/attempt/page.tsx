import Link from "next/link"
import { notFound } from "next/navigation"

import { getExamByIdWithQuestions } from "@/lib/api/exams/queries"
import { shuffleArray } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/Button"
import { DashboardHeader } from "@/components/DashboardHeader"
import { DashboardShell } from "@/components/DashboardShell"
import { ExamForm } from "@/app/(dashboard)/exams/[examId]/attempt/_components/ExamForm"

type ExamAttemptPageProps = {
  params: { examId: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function ExamAttemptPage({
  params,
  searchParams,
}: ExamAttemptPageProps) {
  const exam = await getExamByIdWithQuestions(params.examId)

  if (!exam) return notFound()

  const isRandomOrder = searchParams?.randomOrder === "true" || false

  const shuffledQuestions = (
    isRandomOrder ? shuffleArray(exam.questions) : exam.questions
  ).map((question) => ({
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
        <Link href={`/exams/${exam.id}`} className={buttonVariants()}>
          Cancel
        </Link>
      </DashboardHeader>
      <ExamForm questions={shuffledQuestions} />
    </DashboardShell>
  )
}
