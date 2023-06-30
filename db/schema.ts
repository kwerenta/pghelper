import { InferModel, relations } from "drizzle-orm"
import {
  bigint,
  int,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  serial,
  timestamp,
  tinyint,
  varchar,
} from "drizzle-orm/mysql-core"
import { AdapterAccount } from "next-auth/adapters"

export const users = mysqlTable("users", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: varchar("image", { length: 255 }),
  deanGroup: tinyint("dean_group").notNull().default(0),
})

export const accounts = mysqlTable(
  "accounts",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: varchar("refresh_token", { length: 255 }),
    access_token: varchar("access_token", { length: 255 }),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: varchar("id_token", { length: 255 }),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  })
)

export const sessions = mysqlTable("sessions", {
  sessionToken: varchar("sessionToken", { length: 255 }).notNull().primaryKey(),
  userId: varchar("userId", { length: 255 }).notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = mysqlTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  })
)

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
  studentId: varchar("student_id", { length: 255 }).notNull(),
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
