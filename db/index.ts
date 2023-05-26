import * as schema from "@/db/schema"
import { drizzle } from "drizzle-orm/mysql2"
import { createConnection } from "mysql2"

const connection = createConnection(
  process.env.DATABASE_URL ?? "mysql://root@127.0.0.1:3306/pghelper"
)
export const db = drizzle(connection, { schema })
