import type { FastifyInstance } from "fastify";

async function taskRoutes(app: FastifyInstance) {
  app.get("/", async (request, reply) => {
    return reply.send({ tasks: "Hello task" });
  });
}

export default taskRoutes;