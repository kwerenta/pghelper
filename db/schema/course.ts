import { InferSelectModel, relations } from "drizzle-orm"
import {
  bigint,
  mysqlEnum,
  mysqlTable,
  serial,
  varchar,
} from "drizzle-orm/mysql-core"

import { exams } from "./exam"
import { semesters } from "./semester"
import { timeslotOverrides, timeslots } from "./timeslot"

export const courses = mysqlTable("course", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", [
    "lecture",
    "tutorial",
    "laboratory",
    "project",
  ]).notNull(),
  frequency: mysqlEnum("frequency", [
    "every_week",
    "every_two_weeks",
  ]).notNull(),
  semesterId: bigint("semester_id", { mode: "number", unsigned: true })
    .notNull()
    .references(() => semesters.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
})

export type Course = InferSelectModel<typeof courses>

export const courseRelations = relations(courses, ({ one, many }) => ({
  timeslots: many(timeslots),
  timeslotOverrides: many(timeslotOverrides),
  exams: many(exams),
  semester: one(semesters, {
    fields: [courses.id],
    references: [semesters.id],
  }),
}))
