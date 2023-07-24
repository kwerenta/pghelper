import { relations } from "drizzle-orm"
import {
  bigint,
  boolean,
  mysqlEnum,
  mysqlTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core"

import { courses } from "./timetable"
import { users } from "./user"

export const quizzes = mysqlTable("quizzes", {
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

export const quizzesRelations = relations(quizzes, ({ one, many }) => ({
  course: one(courses, {
    fields: [quizzes.courseId],
    references: [courses.id],
  }),
  author: one(users, {
    fields: [quizzes.authorId],
    references: [users.id],
  }),
  questions: many(questions),
}))

export const questions = mysqlTable("questions", {
  id: serial("id").primaryKey(),
  quizId: varchar("id", { length: 255 }).notNull(),
  text: varchar("text", { length: 1023 }).notNull(),
  type: mysqlEnum("type", ["single", "multi", "truth"]).notNull(),
})

export const questionsRelations = relations(questions, ({ one, many }) => ({
  quiz: one(quizzes, { fields: [questions.quizId], references: [quizzes.id] }),
  answers: many(answers),
}))

export const answers = mysqlTable("answers", {
  id: serial("id").primaryKey(),
  questionId: bigint("question_id", { mode: "number" }).notNull(),
  text: varchar("text", { length: 255 }).notNull(),
  isCorrect: boolean("is_correct").notNull(),
})

export const answersRelations = relations(answers, ({ one }) => ({
  question: one(questions, {
    fields: [answers.questionId],
    references: [questions.id],
  }),
}))
