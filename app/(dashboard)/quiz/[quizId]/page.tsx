import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/session"
import { Button, buttonVariants } from "@/components/ui/Button"
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
import { Icons } from "@/components/Icons"

import { getQuiz } from "./loaders"

type QuizPageProps = {
  params: { quizId: string }
}

export default async function QuizPage({ params }: QuizPageProps) {
  const user = await getCurrentUser()
  if (!user) return redirect("/")

  const quiz = await getQuiz(params.quizId)
  if (!quiz) return notFound()

  return (
    <DashboardShell>
      <DashboardHeader
        title="Quiz"
        description="View quiz details or take a quiz."
      >
        <Link href="/quiz" className={buttonVariants()}>
          Go back
        </Link>
      </DashboardHeader>
      <Card>
        <CardHeader>
          <CardTitle>{quiz.title}</CardTitle>
          <CardDescription>
            {quiz.description ?? "No description."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <div>
            <p>Course:</p>
            <p>Number of questions:</p>
            <p>Author:</p>
            <p>Last update:</p>
          </div>
          <div className="flex-1 font-semibold capitalize">
            <p>{quiz.course.name}</p>
            <p>{quiz.questions.length}</p>
            <p>{quiz.author.name}</p>
            <p>{quiz.updatedAt.toLocaleString()}</p>
          </div>
        </CardContent>
        <CardFooter className="space-x-2">
          <Link
            href={`/quiz/${params.quizId}/attempt`}
            className={buttonVariants()}
          >
            Take a quiz
          </Link>
          {quiz.authorId === user.id ? (
            <>
              <Link
                href={`/quiz/${params.quizId}/edit`}
                className={buttonVariants({ variant: "secondary" })}
              >
                <Icons.penSquare className="mr-2 h-4 w-4" /> Edit
              </Link>
              <Button variant="destructive">
                <Icons.trash className="mr-2 h-4 w-4" /> Delete
              </Button>
            </>
          ) : null}
        </CardFooter>
      </Card>
    </DashboardShell>
  )
}
