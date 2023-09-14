import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/session"
import { formatTimeAgo } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/Button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card"
import { DashboardHeader } from "@/components/DashboardHeader"
import { DashboardShell } from "@/components/DashboardShell"

import { DeleteExamButton } from "./_components/DeleteExamButton"
import { StartExamButton } from "./_components/StartExamButton"
import { getExam } from "./loaders"

type ExamPageProps = {
  params: { examId: string }
}

export default async function ExamPage({ params }: ExamPageProps) {
  const user = await getCurrentUser()
  if (!user) return redirect("/")

  const exam = await getExam(params.examId)
  if (!exam) return notFound()

  return (
    <DashboardShell>
      <DashboardHeader
        title="Exam"
        description="View exam details or start an exam."
      >
        <Link href="/exams" className={buttonVariants()}>
          Go back
        </Link>
      </DashboardHeader>
      <Card>
        <CardHeader>
          <CardTitle>{exam.title}</CardTitle>
          <CardDescription>
            {exam.description ?? "No description."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <div>
            <p>Course:</p>
            <p>Number of questions:</p>
            <p>Author:</p>
            <p>Last update:</p>
          </div>
          <div className="flex-1 font-semibold">
            <p className="capitalize">{exam.course.name}</p>
            <p>{exam.questions.length}</p>
            <p>{exam.author.name}</p>
            <p>{formatTimeAgo(exam.updatedAt)}</p>
          </div>
        </CardContent>
        <CardFooter className="space-x-2">
          <StartExamButton examId={exam.id} />
          {exam.authorId === user.id ? (
            <DeleteExamButton examId={exam.id} />
          ) : null}
        </CardFooter>
      </Card>
    </DashboardShell>
  )
}
