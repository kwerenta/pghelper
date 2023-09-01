"use server"

import crypto from "node:crypto"
import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { answers, courses, exams, questions } from "@/db/schema"
import { and, asc, eq } from "drizzle-orm"

import { validatedAction } from "@/lib/actionValidator"
import { UnauthenticatedException } from "@/lib/exceptions"
import { getCurrentUser } from "@/lib/session"
import { examSchema } from "@/lib/validators/exam"

export const createExam = validatedAction(examSchema, async (data) => {
  const user = await getCurrentUser()
  if (!user) throw new UnauthenticatedException()

  const course = await db
    .select({ id: courses.id })
    .from(courses)
    .where(eq(courses.id, data.courseId))
    .limit(1)

  if (course.length === 0) throw new Error("Provided course does not exist")

  await db.transaction(async (tx) => {
    const examId = crypto.randomUUID()

    await tx.insert(exams).values({
      id: examId,
      title: data.title,
      courseId: data.courseId,
      description: data.description,
      authorId: user.id,
    })

    await tx.insert(questions).values(
      data.questions.map((question) => ({
        examId: examId,
        text: question.text,
        type: question.type,
      })),
    )

    const questiondIds = await tx
      .select({ id: questions.id })
      .from(questions)
      .where(and(eq(questions.examId, examId)))
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

  revalidatePath("/exams")
  return { message: "Successfully created new exam." }
})
