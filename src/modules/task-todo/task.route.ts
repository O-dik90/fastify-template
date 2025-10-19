import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { notFoundSchema } from "./task.schema.ts";
import db from "@/db/index.ts";

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
            createdAt: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date format"}),
            updateAt: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date format"})
          })
        ),
        404: notFoundSchema,
        401: z.object({ error: z.string() }),
      },
    },
    handler: async (request, reply) => {
      // const authHeader = request.headers.authorization;
      // if (!authHeader?.startsWith("Bearer ")) {
      //   return reply.status(401).send({ error: "Unauthorized" });
      // }
      const tasks = await db.query.tasks.findMany();
      console.log(tasks);

      return reply.code(200).send(tasks.map(task => ({
        ...task,
        createdAt: task.createdAt.toISOString(),
        updateAt: task.updatedAt ? task.updatedAt.toISOString() : ""
      })));
    },
  });
}

export { tasksRoutes };