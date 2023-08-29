import Link from "next/link"

import { buttonVariants } from "@/components/ui/Button"
import { DashboardHeader } from "@/components/DashboardHeader"
import { DashboardShell } from "@/components/DashboardShell"
import { ExamCreator } from "@/app/(dashboard)/exam/new/_components/ExamCreator"

import { getCoursesList } from "./loaders"

export default async function NewExamPage() {
  const coursesList = await getCoursesList()

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
