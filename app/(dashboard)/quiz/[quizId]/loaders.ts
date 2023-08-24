import { db } from "@/db"
import { quizzes } from "@/db/schema"
import { eq } from "drizzle-orm"

export const getQuiz = (quizId: string) =>
  db.query.quizzes.findFirst({
    where: eq(quizzes.id, quizId),
    with: {
      questions: {
        with: { answers: true },
      },
    },
  })
