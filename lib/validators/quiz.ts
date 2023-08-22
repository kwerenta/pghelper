import * as z from "zod"

const baseAnswersSchema = z
  .array(
    z.object({
      text: z.string().min(1).max(255),
      isCorrect: z.boolean(),
    }),
  )
  .min(2, "Question must have at least 2 answers")
  .max(8, "Question must have at most 8 answers")

export const quizSchema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().min(1).max(255),
  courseId: z.number(),
  questions: z
    .array(
      z.union([
        z.object({
          text: z.string().min(3).max(1023),
          type: z.literal("single_choice"),
          answers: baseAnswersSchema.refine(
            (answers) =>
              answers.filter((answer) => answer.isCorrect).length === 1,
            {
              message:
                "Single choice question must have exactly 1 correct answer",
            },
          ),
        }),
        z.object({
          text: z.string().min(3).max(1023),
          type: z.literal("multiple_choice"),
          answers: baseAnswersSchema.refine(
            (answers) => answers.some((answer) => answer.isCorrect),
            {
              message:
                "Multiple choice question must have at least 1 correct answer",
            },
          ),
        }),
      ]),
    )
    .min(1)
    .max(255),
})
