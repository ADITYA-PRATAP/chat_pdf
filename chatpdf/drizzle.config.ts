import type { Config } from "drizzle-kit";


export default {
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle", // optional: where migrations are stored
  dialect: "postgresql", // ✅ use 'dialect' not 'driver'
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_E7WnCgawe2KI@ep-sparkling-water-a1usnvxe-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
  },
} satisfies Config;
