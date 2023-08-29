import Link from "next/link"

import { buttonVariants } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { DashboardHeader } from "@/components/DashboardHeader"
import { DashboardShell } from "@/components/DashboardShell"
import { Icons } from "@/components/Icons"

import { getQuizzesList } from "./loaders"

export default async function QuizzesPage() {
  const quizzes = await getQuizzesList()

  return (
    <DashboardShell>
      <DashboardHeader
        title="Quiz"
        description="View all available quizzes for you."
      >
        <Link href="/quiz/new" className={buttonVariants()}>
          <Icons.plusCircle className="mr-2 h-4 w-4" />
          Add quiz
        </Link>
      </DashboardHeader>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {quizzes.length ? (
            quizzes.map((quiz) => (
              <Link
                href={`/quiz/${quiz.id}`}
                key={quiz.id}
                className="flex items-center border-b border-b-border p-3 last:border-b-0 hover:bg-accent hover:text-accent-foreground md:p-4"
              >
                <div className="flex flex-1 flex-col space-y-1.5">
                  <h4 className="text-xl font-semibold leading-none tracking-tight">
                    {quiz.title}
                  </h4>
                  <p className="text-sm capitalize text-muted-foreground">
                    {quiz.course.name}
                  </p>
                </div>
                <div className="mr-3 flex shrink-0 flex-col items-end text-sm md:mr-4">
                  <p className="inline-flex items-center">
                    {quiz.author.name ?? "Unknown author"}
                    <Icons.user className="ml-2 h-4 w-4" />
                  </p>
                  <p className="inline-flex items-center text-muted-foreground">
                    {quiz.createdAt.toLocaleDateString()}
                    <Icons.calendarDays className="ml-2 h-4 w-4" />
                  </p>
                </div>
                <Icons.chevronRight />
              </Link>
            ))
          ) : (
            <p className="p-4">No results.</p>
          )}
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
