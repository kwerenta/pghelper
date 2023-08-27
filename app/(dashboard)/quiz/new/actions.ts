"use server"

import crypto from "node:crypto"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { answers, courses, questions, quizzes } from "@/db/schema"
import { and, asc, eq } from "drizzle-orm"

import { validatedAction } from "@/lib/actionValidator"
import { UnauthenticatedException } from "@/lib/exceptions"
import { getCurrentUser } from "@/lib/session"
import { quizSchema } from "@/lib/validators/quiz"

export const createQuiz = validatedAction(quizSchema, async (data) => {
  const user = await getCurrentUser()
  if (!user) throw new UnauthenticatedException()

  const course = await db
    .select({ id: courses.id })
    .from(courses)
    .where(eq(courses.id, data.courseId))
    .limit(1)

  if (course.length === 0) throw new Error("Provided course does not exist")

  await db.transaction(async (tx) => {
    const quizId = crypto.randomUUID()

    await tx.insert(quizzes).values({
      id: quizId,
      title: data.title,
      courseId: data.courseId,
      description: data.description,
      authorId: user.id,
    })

    await tx.insert(questions).values(
      data.questions.map((question) => ({
        quizId,
        text: question.text,
        type: question.type,
      })),
    )

    const questiondIds = await tx
      .select({ id: questions.id })
      .from(questions)
      .where(and(eq(questions.quizId, quizId)))
      .orderBy(asc(questions.id))
      .limit(1)

    const lastQuestionId = questiondIds[0].id

    const answersData = data.questions.flatMap((questions, index) =>
      questions.answers.map((answer) => ({
        questionId: lastQuestionId + index,
        text: answer.text,
        isCorrect: answer.isCorrect,
      })),
    )

    await tx.insert(answers).values(answersData)
  })

  revalidatePath("/quiz")
  redirect("/quiz")
})
