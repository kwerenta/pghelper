"use server"

import crypto from "node:crypto"
import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { answers, exams, questions } from "@/db/schema"
import { and, asc, eq, inArray } from "drizzle-orm"

import { validatedAction } from "@/lib/actionValidator"
import { getCourseById } from "@/lib/api/queries/courses"
import {
  UnauthenticatedException,
  UnauthorizedException,
} from "@/lib/exceptions"
import { getCurrentUser } from "@/lib/session"
import { examIdSchema, examParamsSchema } from "@/lib/validators/exam"

export const createExam = validatedAction(examParamsSchema, async (data) => {
  const user = await getCurrentUser()
  if (!user) throw new UnauthenticatedException()

  const course = await getCourseById(data.courseId)

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

    const lastQuestionId = questiondIds.at(0)?.id
    if (!lastQuestionId) throw new Error("Failed to create exam")

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

export const deleteExam = validatedAction(
  examIdSchema,
  async ({ id: examId }) => {
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
  },
)
