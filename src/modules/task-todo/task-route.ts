import type { FastifyInstance } from "fastify";
import { getTasks } from "./task-crud.js";

async function taskRoutes(app: FastifyInstance) {
  app.get("/", async (request, reply) => {
    const res = await getTasks();

    return reply.send(res);
  });

  app.get("/:id", {
    schema: {
      tags: ["Tasks"],
      summary: "Get a task by ID",
      description: "Retrieve a specific task using its ID",
      params: {
        type: "object",
        properties: {
          id: { type: "string" }
        },
        required: ["id"]
      }
    },
    handler: async (request, reply) => {
      const { id } = request.params as { id: string };

      return reply.send({ message: `Task with id ${id}` });
    }
  })
}

export default taskRoutes;