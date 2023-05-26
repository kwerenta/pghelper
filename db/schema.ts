import { mysqlEnum, mysqlTable, serial, varchar } from "drizzle-orm/mysql-core"

export const courses = mysqlTable("courses", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  type: mysqlEnum("type", ["lecture", "tutorial", "laboratory", "project"]),
  frequency: mysqlEnum("frequency", ["every_week", "every_two_weeks"]),
})
