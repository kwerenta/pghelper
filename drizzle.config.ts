import { loadEnvConfig } from "@next/env"
import type { Config } from "drizzle-kit"

loadEnvConfig(process.cwd())

export default {
  schema: "./db/schema/index.ts",
  strict: true,
  verbose: true,
  driver: "mysql2",
  dbCredentials: {
    uri: process.env.DATABASE_URL!,
  },
} satisfies Config
