import db from "@/db/index.js";
export const createTask = async () => {
  return { message: "Task created" };
};

export const getTasks = async () => {
  const result = await db.query.tasks.findMany();

  return { tasks: result };
};