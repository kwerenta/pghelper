import { InferSelectModel, relations } from "drizzle-orm"
import {
  bigint,
  boolean,
  date,
  foreignKey,
  index,
  mysqlEnum,
  mysqlTable,
  serial,
  tinyint,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core"

import { courses } from "./course"
import { deanGroups } from "./deanGroup"
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
    startDate: date("start_date"),
    endDate: date("end_date"),
    isOneTime: boolean("is_one_time").default(false).notNull(),
    deanGroupId: bigint("dean_group_id", {
      mode: "number",
      unsigned: true,
    }).references(() => deanGroups.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    subgroup: tinyint("subgroup"),
    parentTimeslotId: bigint("parent_timeslot_id", {
      mode: "number",
      unsigned: true,
    }),
  },
  (timeslot) => ({
    deanGroupIndex: index("dean_group_index").on(timeslot.deanGroupId),
    parentTimeslotKey: foreignKey({
      columns: [timeslot.parentTimeslotId],
      foreignColumns: [timeslot.id],
    }).onDelete("set null"),
  }),
)

export type Timeslot = InferSelectModel<typeof timeslots>

export const timeslotRelations = relations(timeslots, ({ one, many }) => ({
  course: one(courses, {
    fields: [timeslots.courseId],
    references: [courses.id],
  }),
  deanGroup: one(deanGroups, {
    fields: [timeslots.deanGroupId],
    references: [deanGroups.id],
  }),
  exceptions: many(timeslotExceptions),
}))

export const timeslotOverrides = mysqlTable(
  "timeslot_override",
  {
    id: serial("id").primaryKey(),
    studentId: varchar("student_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    // Column used only for uniqueness constraint
    courseId: bigint("course_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => courses.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    timeslotId: bigint("timeslot_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => timeslots.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (timeslot) => ({
    uniqueIndex: uniqueIndex("student_course_index").on(
      timeslot.studentId,
      timeslot.courseId,
    ),
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

export const timeslotExceptions = mysqlTable("timeslot_exception", {
  id: serial("id").primaryKey(),
  timeslotId: bigint("timeslot_id", {
    mode: "number",
    unsigned: true,
  })
    .notNull()
    .references(() => timeslots.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  action: mysqlEnum("action", ["cancel", "reschedule"]).notNull(),
  startTime: tinyint("start_time"),
  endTime: tinyint("end_time"),
  date: date("date").notNull(),
  newDate: date("new_date"),
})

export type TimeslotException = InferSelectModel<typeof timeslotExceptions>

export const timeslotExceptionRelations = relations(
  timeslotExceptions,
  ({ one }) => ({
    timeslot: one(timeslots, {
      fields: [timeslotExceptions.timeslotId],
      references: [timeslots.id],
    }),
  }),
)
