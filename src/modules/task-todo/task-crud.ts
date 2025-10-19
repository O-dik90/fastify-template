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

export const getTaskById = async (id: number) => {
  const task = await db.query.tasks.findFirst({
    where: (tasks, { eq }) => eq(tasks.id, id),
  });

  if (!task) {
    return null;
  }

  return task;
};