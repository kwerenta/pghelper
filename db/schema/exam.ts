import { InferSelectModel, relations } from "drizzle-orm"
import {
  bigint,
  boolean,
  index,
  mysqlEnum,
  mysqlTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core"

import { courses } from "./timetable"
import { users } from "./user"

export const exams = mysqlTable("exams", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }),
  courseId: bigint("course_id", { mode: "number" }).notNull(),
  authorId: varchar("author_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { mode: "date", fsp: 0 })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", fsp: 0 })
    .notNull()
    .defaultNow(),
})

export const examsRelations = relations(exams, ({ one, many }) => ({
  course: one(courses, {
    fields: [exams.courseId],
    references: [courses.id],
  }),
  author: one(users, {
    fields: [exams.authorId],
    references: [users.id],
  }),
  questions: many(questions),
}))

export const questions = mysqlTable(
  "questions",
  {
    id: serial("id").primaryKey(),
    examId: varchar("exam_id", { length: 255 }).notNull(),
    text: varchar("text", { length: 1023 }).notNull(),
    type: mysqlEnum("type", ["single_choice", "multiple_choice"]).notNull(),
  },
  (question) => ({
    examIndex: index("exam_index").on(question.examId),
  }),
)

export const questionsRelations = relations(questions, ({ one, many }) => ({
  exam: one(exams, { fields: [questions.examId], references: [exams.id] }),
  answers: many(answers),
}))

export type Question = InferSelectModel<typeof questions>

export const answers = mysqlTable(
  "answers",
  {
    id: serial("id").primaryKey(),
    questionId: bigint("question_id", { mode: "number" }).notNull(),
    text: varchar("text", { length: 255 }).notNull(),
    isCorrect: boolean("is_correct").notNull(),
  },
  (answer) => ({
    questionIndex: index("question_index").on(answer.questionId),
  }),
)

export const answersRelations = relations(answers, ({ one }) => ({
  question: one(questions, {
    fields: [answers.questionId],
    references: [questions.id],
  }),
}))

export type Answer = InferSelectModel<typeof answers>
