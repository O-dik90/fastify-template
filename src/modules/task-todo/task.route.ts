import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { CreateTaskSchema, MessageTaskSchema, taskID, TaskSchema } from "./task.schema.ts";
import { notAuthorizedSchema } from "@/lib/constants.ts";
import {StatusCodes} from "http-status-codes"
import { createTask, deleteTask, getTaskById, getTasks, updateTask } from "./task-crud.ts";

async function tasksRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: {
      tags: ["Tasks"],
      summary: "Get Tasks",
      response: {
        [StatusCodes.OK]: z.array(TaskSchema),
        [StatusCodes.NOT_FOUND]: MessageTaskSchema,
        [StatusCodes.UNAUTHORIZED]: notAuthorizedSchema,
      },
    },
    handler: getTasks,
  })
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/:id",
    schema: {
      tags: ["Tasks"],
      params: taskID,
      summary: "Get Task by ID",
      response: {
        [StatusCodes.OK]: TaskSchema,
        [StatusCodes.NOT_FOUND]: MessageTaskSchema,
        [StatusCodes.UNAUTHORIZED]: notAuthorizedSchema,
      },
    },
    handler: getTaskById,
  })
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/create",
    schema: {
      tags: ["Tasks"],
      summary: "Create Task",
      body: CreateTaskSchema.omit({ id: true, createdAt: true, updatedAt: true }),
      response: {
        [StatusCodes.CREATED]: MessageTaskSchema,
        [StatusCodes.INTERNAL_SERVER_ERROR]: MessageTaskSchema,
        401: notAuthorizedSchema,
      },
    },
    handler: createTask,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "DELETE",
    url: "/:id",
    schema: {
      tags: ["Tasks"],
      params: taskID,
      summary: "Delete Task by ID",
      response: {
        [StatusCodes.OK]: MessageTaskSchema,
        [StatusCodes.NOT_FOUND]: MessageTaskSchema,
        [StatusCodes.INTERNAL_SERVER_ERROR]: MessageTaskSchema,
        [StatusCodes.UNAUTHORIZED]: notAuthorizedSchema,
      },
    },
    handler: deleteTask,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "PUT",
    url: "/:id",
    schema: {
      tags: ["Tasks"],
      params: taskID,
      summary: "Update Task by ID",
      body: CreateTaskSchema.partial().omit({ id: true, createdAt: true, updatedAt: true }),
      
      response: {
        [StatusCodes.OK]: MessageTaskSchema,
        [StatusCodes.NOT_FOUND]: MessageTaskSchema,
        [StatusCodes.INTERNAL_SERVER_ERROR]: MessageTaskSchema,
        [StatusCodes.UNAUTHORIZED]: notAuthorizedSchema,
      },
    },
    handler: updateTask,
  });
}

export { tasksRoutes };