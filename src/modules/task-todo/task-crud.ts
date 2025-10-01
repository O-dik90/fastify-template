import db from "@/db/index.js";
import { log } from "console";
export const createTask = async () => {
  return { message: "Task created" };
};

export const getTasks = async () => {
  const result = await db.query.tasks.findMany();
  log(result);

  return { tasks: result };
};