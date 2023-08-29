"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { answers, questions, quizzes } from "@/db/schema"
import { eq, inArray } from "drizzle-orm"
import { z } from "zod"

import { validatedAction } from "@/lib/actionValidator"
import {
  UnauthenticatedException,
  UnauthorizedException,
} from "@/lib/exceptions"
import { getCurrentUser } from "@/lib/session"

export const deleteQuiz = validatedAction(z.string().uuid(), async (quizId) => {
  const user = await getCurrentUser()
  if (!user) throw new UnauthenticatedException()

  const quiz = await db.query.quizzes.findFirst({
    columns: { id: true, authorId: true },
    with: {
      questions: {
        columns: { id: true },
      },
    },
    where: eq(quizzes.id, quizId),
  })

  if (!quiz) throw new Error("Quiz not found.")

  if (quiz.authorId !== user.id)
    throw new UnauthorizedException("You are not the author of this quiz.")

  db.transaction(async (tx) => {
    const questionIds = quiz.questions.map((q) => q.id)

    await tx.delete(answers).where(inArray(answers.questionId, questionIds))
    await tx.delete(questions).where(inArray(questions.id, questionIds))
    await tx.delete(quizzes).where(eq(quizzes.id, quizId))
  })

  revalidatePath("/quiz")

  return { message: "Successfully deleted quiz." }
})
