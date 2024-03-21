import Link from "next/link"

import { getCourses } from "@/lib/api/queries/courses"
import { buttonVariants } from "@/components/ui/Button"
import { DashboardHeader } from "@/components/DashboardHeader"
import { DashboardShell } from "@/components/DashboardShell"
import { ExamCreator } from "@/app/(dashboard)/exams/new/_components/ExamCreator"

export default async function NewExamPage() {
  const coursesList = await getCourses()

  return (
    <DashboardShell>
      <DashboardHeader title="Exam creator" description="Create new exam.">
        <Link href="/exams" className={buttonVariants()}>
          Go back
        </Link>
      </DashboardHeader>
      <ExamCreator courses={coursesList} />
    </DashboardShell>
  )
}
