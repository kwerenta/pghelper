import crypto from "node:crypto"
import { NextResponse } from "next/server"
import { db } from "@/db"
import { answers, courses, questions, quizzes } from "@/db/schema"
import { DrizzleError, and, asc, eq } from "drizzle-orm"
import { getServerSession } from "next-auth"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { quizSchema } from "@/lib/validators/quiz"

export const POST = async (req: Request) => {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "You are not logged in." },
        { status: 401 },
      )
    }

    const body = await req.json()
    const data = quizSchema.parse(body)

    const course = await db
      .select({ id: courses.id })
      .from(courses)
      .where(eq(courses.id, data.courseId))

    if (course.length === 0)
      return NextResponse.json(
        { message: "Provided course dose not exist." },
        { status: 400 },
      )

    await db.transaction(async (tx) => {
      const quizId = crypto.randomUUID()

      await tx.insert(quizzes).values({
        id: quizId,
        title: data.title,
        courseId: data.courseId,
        description: data.description,
        authorId: session.user.id,
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

    return NextResponse.json(
      { message: "Quiz successfully created." },
      { status: 200 },
    )
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Failed to validate sent data." },
        { status: 422 },
      )
    }
    if (e instanceof DrizzleError) {
      return NextResponse.json(
        { message: "Failed to save timetable changes." },
        { status: 500 },
      )
    }
    return NextResponse.json(
      {
        message: "Something went wrong. Try again later. " + JSON.stringify(e),
      },
      { status: 500 },
    )
  }
}
