import * as schema from "@/db/schema"
import { drizzle } from "drizzle-orm/mysql2"
import { createConnection } from "mysql2"

const connection = createConnection(process.env.DATABASE_URL!)
export const db = drizzle(connection, { schema, mode: "default" })

export type DatabaseInstance = typeof db
