import * as z from "zod"

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

export const examSchema = z.object({
  title: z
    .string({ required_error: "Please enter a title for the exam" })
    .min(3, "Question title must be at least 3 characters long")
    .max(255, "Question title must be less than 256 characters long"),
  description: z
    .string({ required_error: "Please enter a description for the exam" })
    .max(255, "Question description must be less than 256 characters long"),
  courseId: z.number().positive({ message: "Please select a course" }),
  questions: z
    .array(
      z.union([
        z.object({
          text: questionTextSchema,
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
          text: questionTextSchema,
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
    .min(1, "Exam must have at least 1 question")
    .max(255, "Exam must have less than 256 questions"),
})

export type NewExamValues = z.infer<typeof examSchema>
