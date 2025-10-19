import db from "@/db/index.js";
import { FastifyRequest, FastifyReply } from "fastify";
import { log } from "console";
import { eq } from "drizzle-orm/sql";
import { StatusCodes } from "http-status-codes";
import { create_task, task_id } from "./task.schema.js";
import { tasks } from "@/db/schema/tasks.js";

export const getTasks = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const result = await db.query.tasks.findMany();
    log(result);

    return res.send(result);
  } catch (error) {
    if (error instanceof Error) {
      return res.code(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: `Internal Server Error , ${error.message}` });
    }

    return res.code(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: `Internal Server Error` });
  }
};

export const getTaskById = async (req: FastifyRequest<{ Params: task_id }>, res: FastifyReply) => {
  try {
    const { id } = req.params;

    const task = await db.query.tasks.findFirst({
      where: (item) => eq(item.id, Number(id))
    });
    log(task);

    if (!task) {
      return res.code(StatusCodes.NOT_FOUND).send({ message: "Task not found" });
    }
    return res.code(StatusCodes.OK).send(task);
  } catch (error) {
    if (error instanceof Error) {
      return res.code(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: `Internal Server Error , ${error.message}` });
    }

    return res.code(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: `Internal Server Error` });
  }
};

export const createTask = async (req: FastifyRequest<{ Body: create_task }>, res: FastifyReply) => {
  try {
    const { title, description } = req.body;

    const [newTask] = await db
      .insert(tasks)
      .values({
        title,
        description: description ?? "",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .$returningId();

    return res.code(StatusCodes.CREATED).send({
      message: "Task created",
      id: newTask?.id,
    });
  }
  catch (error) {
    log(error);
    if (error instanceof Error) {
      return res.code(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: `Internal Server Error , ${error.message}` });
    }

    return res.code(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: `Internal Server Error` });
  }
}

export const deleteTask = async (req: FastifyRequest<{ Params: task_id }>, res: FastifyReply) => {
  try {
    const { id } = req.params;

    const task = await db.query.tasks.findFirst({
      where: (item) => eq(item.id, Number(id))
    });

    if (!task) {
      return res.code(StatusCodes.NOT_FOUND).send({ message: "Task not found" });
    }

    await db.delete(tasks).where(eq(tasks.id, Number(id)));

    return res.code(StatusCodes.OK).send({ message: "Task deleted successfully" });
  } catch (error) {
    if (error instanceof Error) {
      return res.code(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: `Internal Server Error , ${error.message}` });
    }

    return res.code(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: `Internal Server Error` });
  }
};

export const updateTask = async (req: FastifyRequest<{ Params: task_id; Body: Partial<create_task> }>, res: FastifyReply) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const task = await db.query.tasks.findFirst({
      where: (item) => eq(item.id, Number(id))
    });

    if (!task) {
      return res.code(StatusCodes.NOT_FOUND).send({ message: "Task not found" });
    }

    await db.update(tasks)
      .set({
        title: title ?? task.title,
        description: description ?? task.description,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, Number(id)));

    return res.code(StatusCodes.OK).send({ message: "Task updated successfully" });
  } catch (error) {
    if (error instanceof Error) {
      return res.code(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: `Internal Server Error , ${error.message}` });
    }

    return res.code(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: `Internal Server Error` });
  }
};