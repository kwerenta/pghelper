import { db } from "@/db"
import { exams } from "@/db/schema"
import { eq } from "drizzle-orm"

export const getExam = (examId: string) =>
  db.query.exams.findFirst({
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
