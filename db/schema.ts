import { InferModel, relations } from "drizzle-orm"
import {
  bigint,
  mysqlEnum,
  mysqlTable,
  serial,
  tinyint,
  varchar,
} from "drizzle-orm/mysql-core"

export const courses = mysqlTable("courses", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
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
  timetables: many(timetable),
  studentAttendances: many(studentAttendances),
}))

export const timetable = mysqlTable("timetable", {
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

export const timetableRelations = relations(timetable, ({ one }) => ({
  course: one(courses, {
    fields: [timetable.courseId],
    references: [courses.id],
  }),
}))

export const studentAttendances = mysqlTable("student_attendances", {
  id: serial("id").primaryKey(),
  studentId: varchar("student_id", { length: 32 }).notNull(),
  courseId: bigint("course_id", { mode: "number" }).notNull(),
  deanGroup: tinyint("dean_group").notNull(),
})

export const studentAttendancesRelations = relations(
  studentAttendances,
  ({ one }) => ({
    course: one(courses, {
      fields: [studentAttendances.courseId],
      references: [courses.id],
    }),
  })
)
