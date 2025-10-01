import { int, mysqlTable, text, timestamp } from "drizzle-orm/mysql-core";

export const tasks = mysqlTable("tasks", {
  id: int("id").primaryKey().autoincrement(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});
