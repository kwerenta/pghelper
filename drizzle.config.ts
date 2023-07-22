import * as dotEnv from "dotenv"
import type { Config } from "drizzle-kit"

dotEnv.config({ path: ".env.local" })

export default {
  schema: "./db/schema/index.ts",
  strict: true,
  verbose: true,
  driver: "mysql2",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config
