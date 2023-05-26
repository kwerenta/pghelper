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

export const timetable = mysqlTable("timetable", {
  id: serial("id").primaryKey(),
  courseId: bigint("course_id", { mode: "bigint" }).notNull(),
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
