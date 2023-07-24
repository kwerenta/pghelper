import { db } from "@/db"

export const getQuizzesList = () =>
  db.query.quizzes.findMany({
    with: {
      author: { columns: { name: true } },
      course: { columns: { name: true } },
    },
    orderBy: (quizzes, { desc }) => desc(quizzes.createdAt),
  })
