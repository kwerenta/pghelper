"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { answers, exams, questions } from "@/db/schema"
import { eq, inArray } from "drizzle-orm"
import { z } from "zod"

import { validatedAction } from "@/lib/actionValidator"
import {
  UnauthenticatedException,
  UnauthorizedException,
} from "@/lib/exceptions"
import { getCurrentUser } from "@/lib/session"

export const deleteExam = validatedAction(z.string().uuid(), async (examId) => {
  const user = await getCurrentUser()
  if (!user) throw new UnauthenticatedException()

  const exam = await db.query.exams.findFirst({
    columns: { id: true, authorId: true },
    with: {
      questions: {
        columns: { id: true },
      },
    },
    where: eq(exams.id, examId),
  })

  if (!exam) throw new Error("Exam not found.")

  if (exam.authorId !== user.id)
    throw new UnauthorizedException("You are not the author of this exam.")

  db.transaction(async (tx) => {
    const questionIds = exam.questions.map((q) => q.id)

    await tx.delete(answers).where(inArray(answers.questionId, questionIds))
    await tx.delete(questions).where(inArray(questions.id, questionIds))
    await tx.delete(exams).where(eq(exams.id, examId))
  })

  revalidatePath("/exams")

  return { message: "Successfully deleted exam." }
})
