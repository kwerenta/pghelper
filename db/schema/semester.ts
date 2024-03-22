import { InferSelectModel } from "drizzle-orm"
import { datetime, mysqlTable, serial, tinyint } from "drizzle-orm/mysql-core"

export const semesters = mysqlTable("semester", {
  id: serial("id").primaryKey(),
  number: tinyint("number").notNull(),
  startDate: datetime("start_date").notNull(),
  endDate: datetime("end_date").notNull(),
})

export type Semester = InferSelectModel<typeof semesters>
export type SemesterId = Semester["id"]
