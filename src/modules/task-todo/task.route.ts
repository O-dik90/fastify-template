import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { notFoundSchema } from "./task.schema.ts";
import db from "@/db/index.ts";
import { notAuthorizedSchema } from "@/lib/constants.ts";
import { eq } from "drizzle-orm/sql";
import { tasks } from "@/db/schema/tasks.ts";

async function tasksRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: {
      tags: ["Tasks"],
      summary: "Get Tasks",
      security: [{ bearerAuth: [] }],
      response: {
        200: z.array(
          z.object({
            id: z.number().int().positive(),
            title: z.string(),
            description: z.string(),
            createdAt: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date format" }),
            updateAt: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date format" })
          })
        ),
        404: notFoundSchema,
        401: notAuthorizedSchema,
      },
    },
    handler: async (request, reply) => {
      const tasks = await db.query.tasks.findMany();
      console.log(tasks);

      return reply.code(200).send(tasks.map(task => ({
        ...task,
        createdAt: task.createdAt.toISOString(),
        updateAt: task.updatedAt ? task.updatedAt.toISOString() : ""
      })));
    },
  })
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/:id",
    schema: {
      tags: ["Tasks"],
      params: z.object({
        id: z.string().optional(),
      }),
      summary: "Get Task by ID",
      response: {
        200: z.object({
          id: z.number().int().positive(),
          title: z.string(),
          description: z.string(),
          createdAt: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date format" }),
          updateAt: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date format" })
        }),
        404: notFoundSchema,
        401: notAuthorizedSchema,
      },
    },
    handler: async (request, reply) => {
      const { id } = request.params;
      const task = await db.query.tasks.findFirst({
        where: (item) => eq(item.id, Number(id))
      });

      if (!task) {
        return reply.code(404).send({ message: "Task not found" });
      }
      return reply.code(200).send({
        ...task,
        createdAt: task.createdAt.toISOString(),
        updateAt: task.updatedAt ? task.updatedAt.toISOString() : ""
      });
    }
  })
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/create",
    schema: {
      tags: ["Tasks"],
      summary: "Create Task",
      body: z.object({
        title: z.string().min(1),
        description: z.string().optional(),
      }),
      response: {
        200: z.object({
          message: z.string().optional(),
          id: z.number().int().positive().optional(),
        }),
        401: notAuthorizedSchema,
      },
    },
    handler: async (request, reply) => {
      const { title, description } = request.body;

      const [newTask] = await db
        .insert(tasks)
        .values({
          title,
          description: description ?? "",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .$returningId();

      return reply.code(200).send({
        message: "Task created",
        id: newTask?.id,
      });
    },
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "DELETE",
    url: "/:id",
    schema: {
      tags: ["Tasks"],
      params: z.object({
        id: z.string().optional(),
      }),
      summary: "Delete Task by ID",
      response: {
        200: z.object({
          message: z.string(),
        }),
        404: notFoundSchema,
        401: notAuthorizedSchema,
      },
    },
    handler: async (request, reply) => {
      const { id } = request.params;

      const task = await db.query.tasks.findFirst({
        where: (item) => eq(item.id, Number(id))
      });

      if (!task) {
        return reply.code(404).send({ message: "Task not found" });
      }

      await db.delete(tasks).where(eq(tasks.id, Number(id)));
      return reply.code(200).send({ message: "Task deleted successfully" });
    }
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "PUT",
    url: "/:id",
    schema: {
      tags: ["Tasks"],
      params: z.object({
        id: z.string().optional(),
      }),
      summary: "Update Task by ID",
      body: z.object({
        title: z.string().min(1).optional(),
        description: z.string().optional(),
      }),
      response: {
        200: z.object({
          message: z.string(),
        }),
        404: notFoundSchema,
        401: notAuthorizedSchema,
      },
    },
    handler: async (request, reply) => {
      const { id } = request.params;
      const { title, description } = request.body;

      const task = await db.query.tasks.findFirst({
        where: (item) => eq(item.id, Number(id))
      });

      if (!task) {
        return reply.code(404).send({ message: "Task not found" });
      }

      await db.update(tasks)
        .set({
          title: title ?? task.title,
          description: description ?? task.description,
          updatedAt: new Date(),
        })
        .where(eq(tasks.id, Number(id)));

      return reply.code(200).send({ message: "Task updated successfully" });
    }
  });
}

export { tasksRoutes };