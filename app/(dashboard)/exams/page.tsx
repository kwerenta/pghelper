import Link from "next/link"

import { getExamsWithAuthorAndCourse } from "@/lib/api/queries/exams"
import { formatTimeAgo } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { DashboardHeader } from "@/components/DashboardHeader"
import { DashboardShell } from "@/components/DashboardShell"
import { Icons } from "@/components/Icons"

export default async function ExamsPage() {
  const exams = await getExamsWithAuthorAndCourse()

  return (
    <DashboardShell>
      <DashboardHeader
        title="Exam"
        description="View all available exams for you."
      >
        <Link href="/exams/new" className={buttonVariants()}>
          <Icons.plusCircle className="mr-2 h-4 w-4" />
          Add exam
        </Link>
      </DashboardHeader>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {exams.length ? (
            exams.map((exam) => (
              <Link
                href={`/exams/${exam.id}`}
                key={exam.id}
                className="flex items-center border-b border-b-border p-3 last:border-b-0 hover:bg-accent hover:text-accent-foreground md:p-4"
              >
                <div className="flex flex-1 flex-col space-y-1.5">
                  <h4 className="text-xl font-semibold leading-none tracking-tight">
                    {exam.title}
                  </h4>
                  <p className="text-sm capitalize text-muted-foreground">
                    {exam.course.name}
                  </p>
                </div>
                <div className="mr-3 flex shrink-0 flex-col items-end text-sm md:mr-4">
                  <p className="inline-flex items-center">
                    {exam.author.name ?? "Unknown author"}
                    <Icons.user className="ml-2 h-4 w-4" />
                  </p>
                  <p
                    title={`Created at ${exam.createdAt.toLocaleString()}`}
                    className="inline-flex items-center text-muted-foreground"
                  >
                    {formatTimeAgo(exam.createdAt)}
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
