import { db } from "@/db"

export const getExamsList = () =>
  db.query.exams.findMany({
    with: {
      author: { columns: { name: true } },
      course: { columns: { name: true } },
    },
    orderBy: (exams, { desc }) => desc(exams.createdAt),
  })
