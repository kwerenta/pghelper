import { InferSelectModel, relations } from "drizzle-orm"
import {
  bigint,
  boolean,
  mysqlTable,
  serial,
  tinyint,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core"

import { semesters } from "./semester"
import { users } from "./user"

export const deanGroups = mysqlTable("dean_group", {
  id: serial("id").primaryKey(),
  number: tinyint("number").notNull(),
  semesterId: bigint("semester_id", {
    mode: "number",
    unsigned: true,
  })
    .notNull()
    .references(() => semesters.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  stream: varchar("stream", { length: 255 }),
  profile: varchar("profile", { length: 255 }),
})

export const deanGroupRelations = relations(deanGroups, ({ one, many }) => ({
  studentDeanGroups: many(studentDeanGroups),
  semester: one(semesters, {
    fields: [deanGroups.semesterId],
    references: [semesters.id],
  }),
}))

export type DeanGroup = InferSelectModel<typeof deanGroups>
export type DeanGroupId = DeanGroup["id"]

export const studentDeanGroups = mysqlTable(
  "student_dean_group",
  {
    id: serial("id").primaryKey(),
    studentId: varchar("student_id", { length: 255 })
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    deanGroupId: bigint("dean_group_id", {
      mode: "number",
      unsigned: true,
    })
      .notNull()
      .references(() => deanGroups.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    isActive: boolean("is_active").notNull().default(false),
  },
  (studentDeanGroup) => ({
    index: uniqueIndex("student_dean_group_index").on(
      studentDeanGroup.studentId,
      studentDeanGroup.deanGroupId,
    ),
  }),
)

export const studentDeanGroupRelations = relations(
  studentDeanGroups,
  ({ one }) => ({
    student: one(users, {
      fields: [studentDeanGroups.studentId],
      references: [users.id],
    }),
    deanGroup: one(deanGroups, {
      fields: [studentDeanGroups.deanGroupId],
      references: [deanGroups.id],
    }),
  }),
)
