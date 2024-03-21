import { InferSelectModel, relations } from "drizzle-orm"
import {
  bigint,
  index,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  serial,
  tinyint,
  varchar,
} from "drizzle-orm/mysql-core"

import { courses } from "./course"
import { users } from "./user"

export const timeslots = mysqlTable(
  "timeslot",
  {
    id: serial("id").primaryKey(),
    courseId: bigint("course_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => courses.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
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
  },
  (timeslot) => ({
    deanGroupIndex: index("dean_group_index").on(timeslot.deanGroup),
  }),
)

export type Timeslot = InferSelectModel<typeof timeslots>

export const timeslotRelations = relations(timeslots, ({ one }) => ({
  course: one(courses, {
    fields: [timeslots.courseId],
    references: [courses.id],
  }),
}))

export const timeslotOverrides = mysqlTable(
  "timeslot_override",
  {
    studentId: varchar("student_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    courseId: bigint("course_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => courses.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    deanGroup: tinyint("dean_group").notNull(),
  },
  (timeslot) => ({
    compoundKey: primaryKey({
      columns: [timeslot.studentId, timeslot.courseId],
    }),
  }),
)

export const timeslotOverrideRelations = relations(
  timeslotOverrides,
  ({ one }) => ({
    course: one(courses, {
      fields: [timeslotOverrides.courseId],
      references: [courses.id],
    }),
  }),
)
