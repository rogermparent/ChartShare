import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const charts = sqliteTable("charts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  chartData: text("chart_data").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date().toISOString()),
});

export type Chart = typeof charts.$inferSelect;
export type NewChart = typeof charts.$inferInsert;
