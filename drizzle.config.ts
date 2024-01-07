import type { Config } from "drizzle-kit";

export default {
  schema: "./src/models/schema.ts",
  out: "./drizzle/migrations",
  driver: "d1",
  dbCredentials: {
    wranglerConfigPath: "wrangler.toml",
    dbName: "jp-castles-db",
  },
} satisfies Config;
