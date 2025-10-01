import 'module-alias/register.js';

import fastify from "fastify";
import taskRoutes from "@/modules/task-todo/task-route.js";
import { env } from "@/config/env.js";

const server = fastify({ logger: true });

server.get("/", async (_, reply) => {
  return { hello: "world" };
});


const main = async () => {
  server.register(taskRoutes, { prefix: "/api/tasks" });
  
  try {
    await server.listen({ port: env.PORT });
    console.log(`🚀 Server listening at http://${env.HOST}:${env.PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

main();
