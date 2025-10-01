import type { FastifyInstance } from "fastify";
import { getTasks } from "./task-crud.js";

async function taskRoutes(app: FastifyInstance) {
  app.get("/", async (request, reply) => {
    const res = await getTasks();

    return reply.send({ tasks: res });
  });
}

export default taskRoutes;