import { z } from "zod"

const baseAnswersSchema = z
  .array(
    z.object({
      text: z
        .string({ required_error: "Please enter a text for the answer" })
        .max(255, "Answer text must be less than 256 characters long"),
      isCorrect: z.boolean(),
    }),
  )
  .min(2, "Question must have at least 2 answers")
  .max(8, "Question must have less than 9 answers")

const questionTextSchema = z
  .string({ required_error: "Please enter a text for the question" })
  .min(3, "Question text must be at least 3 characters long")
  .max(1023, "Question text must be less than 1024 characters long")

const baseQuestionSchema = z.discriminatedUnion("type", [
  z.object({
    text: questionTextSchema,
    type: z.literal("single_choice"),
    answers: baseAnswersSchema.refine(
      (answers) => answers.filter((answer) => answer.isCorrect).length === 1,
      {
        message: "Single choice question must have exactly 1 correct answer",
      },
    ),
  }),
  z.object({
    text: questionTextSchema,
    type: z.literal("multiple_choice"),
    answers: baseAnswersSchema.refine(
      (answers) => answers.some((answer) => answer.isCorrect),
      {
        message: "Multiple choice question must have at least 1 correct answer",
      },
    ),
  }),
])

export const examSchema = z.object({
  id: z.string().uuid(),
  title: z
    .string({ required_error: "Please enter a title for the exam" })
    .min(3, "Question title must be at least 3 characters long")
    .max(255, "Question title must be less than 256 characters long"),
  description: z
    .string()
    .max(255, "Question description must be less than 256 characters long")
    .nullable(),
  courseId: z.number().positive({ message: "Please select a course" }),
  questions: z
    .array(baseQuestionSchema)
    .min(1, "Exam must have at least 1 question")
    .max(255, "Exam must have less than 256 questions"),
})

export const examIdSchema = examSchema.pick({ id: true })
export const examParamsSchema = examSchema.omit({ id: true })

export type NewExamParams = z.infer<typeof examParamsSchema>

export const examAttempSchema = z.object({
  questions: z.array(
    z.object({
      id: z.number().positive(),
      answers: z.array(z.number()),
    }),
  ),
})

export type ExamAttemptParams = z.infer<typeof examAttempSchema>
