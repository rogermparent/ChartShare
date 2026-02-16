import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "../packages/chartshare-common/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: "./sqlite.db",
  },
});
