import { InferModel, relations } from "drizzle-orm"
import {
  bigint,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  serial,
  tinyint,
  varchar,
} from "drizzle-orm/mysql-core"

import { quizzes } from "./quiz"

export const timeslots = mysqlTable("timeslots", {
  id: serial("id").primaryKey(),
  courseId: bigint("course_id", { mode: "number" }).notNull(),
  weekday: mysqlEnum("weekday", [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
  ]).notNull(),
  startTime: tinyint("start_time").notNull(),
  endTime: tinyint("end_time").notNull(),
  deanGroup: tinyint("dean_group").notNull().default(0),
})

export type Timeslot = InferModel<typeof timeslots>

export const timeslotsRelations = relations(timeslots, ({ one }) => ({
  course: one(courses, {
    fields: [timeslots.courseId],
    references: [courses.id],
  }),
}))

export const timeslotsOverrides = mysqlTable(
  "timeslots_overrides",
  {
    studentId: varchar("student_id", { length: 255 }).notNull(),
    courseId: bigint("course_id", { mode: "number" }).notNull(),
    deanGroup: tinyint("dean_group").notNull(),
  },
  (timeslot) => ({
    compoundKey: primaryKey(timeslot.studentId, timeslot.courseId),
  }),
)

export const timeslotsOverridesRelations = relations(
  timeslotsOverrides,
  ({ one }) => ({
    course: one(courses, {
      fields: [timeslotsOverrides.courseId],
      references: [courses.id],
    }),
  }),
)

export const courses = mysqlTable("courses", {
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

export type Course = InferModel<typeof courses>

export const coursesRelations = relations(courses, ({ many }) => ({
  timeslots: many(timeslots),
  customTimeslots: many(timeslotsOverrides),
  quizzes: many(quizzes),
}))
