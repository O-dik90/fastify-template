import z from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { tasks } from "@/db/schema/tasks.js";


export const MessageTaskSchema = z.object({
  message: z.string(),
});

export const taskID = z.object({
  id: z.string(),
});

// for routing
export const TaskSchema = createSelectSchema(tasks);
export const CreateTaskSchema = createInsertSchema(tasks);
// for crud
export type task_id = z.infer<typeof taskID>;
export type create_task = z.infer<typeof CreateTaskSchema>;