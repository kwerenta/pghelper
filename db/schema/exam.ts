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

import { courses } from "./course"
import { users } from "./user"

export const exams = mysqlTable("exam", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }),
  courseId: bigint("course_id", { mode: "number", unsigned: true })
    .notNull()
    .references(() => courses.id, { onDelete: "cascade", onUpdate: "cascade" }),
  authorId: varchar("author_id", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
})

export const examRelations = relations(exams, ({ one, many }) => ({
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
  "question",
  {
    id: serial("id").notNull().primaryKey(),
    examId: varchar("exam_id", { length: 255 })
      .notNull()
      .references(() => exams.id, { onDelete: "cascade", onUpdate: "cascade" }),
    text: varchar("text", { length: 1023 }).notNull(),
    type: mysqlEnum("type", ["single_choice", "multiple_choice"]).notNull(),
  },
  (question) => ({
    examIndex: index("exam_index").on(question.examId),
  }),
)

export const questionRelations = relations(questions, ({ one, many }) => ({
  exam: one(exams, { fields: [questions.examId], references: [exams.id] }),
  answers: many(answers),
}))

export type Question = InferSelectModel<typeof questions>

export const answers = mysqlTable(
  "answer",
  {
    id: serial("id").primaryKey(),
    questionId: bigint("question_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => questions.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    text: varchar("text", { length: 255 }).notNull(),
    isCorrect: boolean("is_correct").notNull(),
  },
  (answer) => ({
    questionIndex: index("question_index").on(answer.questionId),
  }),
)

export const answerRelations = relations(answers, ({ one }) => ({
  question: one(questions, {
    fields: [answers.questionId],
    references: [questions.id],
  }),
}))

export type Answer = InferSelectModel<typeof answers>
