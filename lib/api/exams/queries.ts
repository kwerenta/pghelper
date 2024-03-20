import "server-only"
import { db } from "@/db"
import { exams } from "@/db/schema"
import { eq } from "drizzle-orm"

export const getExamByIdWithQuestions = async (examId: string) =>
  await db.query.exams.findFirst({
    where: eq(exams.id, examId),
    with: {
      questions: {
        with: { answers: true },
      },
      course: {
        columns: {
          name: true,
        },
      },
      author: {
        columns: {
          name: true,
        },
      },
    },
  })

export const getExamsWithAuthorAndCourse = async () =>
  await db.query.exams.findMany({
    with: {
      author: { columns: { name: true } },
      course: { columns: { name: true } },
    },
    orderBy: (exams, { desc }) => desc(exams.createdAt),
  })
