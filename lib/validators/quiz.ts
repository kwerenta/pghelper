import * as z from "zod"

const baseAnswersSchema = z.array(
  z.object({
    text: z.string().min(1).max(255),
    isCorrect: z.boolean(),
  }),
)

export const quizSchema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().min(1).max(255),
  course: z.string().min(1).max(255),
  questions: z
    .array(
      z.union([
        z.object({
          text: z.string().min(3).max(1023),
          type: z.literal("single_choice"),
          answers: baseAnswersSchema
            .min(2)
            .max(8)
            .refine(
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
          type: z.literal("multi_choice"),
          answers: baseAnswersSchema
            .min(2)
            .max(8)
            .refine((answers) => answers.some((answer) => answer.isCorrect), {
              message:
                "Multiple choice question must have at least 1 correct answer",
            }),
        }),
        z.object({
          text: z.string().min(3).max(1023),
          type: z.literal("true_or_false"),
          answers: baseAnswersSchema
            .length(2)
            .refine(
              (answers) =>
                answers.filter((answer) => answer.isCorrect).length === 1,
              {
                message:
                  "True or false question must have exactly 1 correct answer",
              },
            ),
        }),
      ]),
    )
    .min(1)
    .max(255),
})
