import type { Config } from "drizzle-kit"

export default {
  schema: "./db/schema.ts",
  connectionString:
    process.env.DATABASE_URL ?? "mysql://root@127.0.0.1:3306/pghelper",
} satisfies Config
