import Link from "next/link"
import { db } from "@/db"
import { courses } from "@/db/schema"
import { and, eq, gt, isNull } from "drizzle-orm"
import { alias } from "drizzle-orm/mysql-core"

import { buttonVariants } from "@/components/ui/Button"
import { DashboardHeader } from "@/components/DashboardHeader"
import { DashboardShell } from "@/components/DashboardShell"
import { QuizCreator } from "@/components/QuizCreator"

export default async function NewQuizPage() {
  const coursesAlias = alias(courses, "coursesAlias")
  const coursesList = await db
    .select({ id: courses.id, name: courses.name })
    .from(courses)
    .leftJoin(
      coursesAlias,
      and(eq(courses.name, coursesAlias.name), gt(courses.id, coursesAlias.id)),
    )
    .where(isNull(coursesAlias.id))

  return (
    <DashboardShell>
      <DashboardHeader title="Quiz creator" description="Create new quiz.">
        <Link href="/quiz" className={buttonVariants()}>
          Go back
        </Link>
      </DashboardHeader>
      <QuizCreator courses={coursesList} />
    </DashboardShell>
  )
}
