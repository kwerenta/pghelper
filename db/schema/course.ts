import { InferSelectModel, relations } from "drizzle-orm"
import { mysqlEnum, mysqlTable, serial, varchar } from "drizzle-orm/mysql-core"

import { exams } from "./exam"
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
})

export type Course = InferSelectModel<typeof courses>

export const courseRelations = relations(courses, ({ many }) => ({
  timeslots: many(timeslots),
  timeslotOverrides: many(timeslotOverrides),
  exams: many(exams),
}))
