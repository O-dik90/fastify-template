import 'module-alias/register.js';

import { env } from "@/config/env.js";
import { createApp } from '@/lib/create-app.ts';
import { tasksRoutes } from '@/modules/task-todo/task.route.ts';
import { authMiddleware } from '@/middleware/auth-middleware.ts';
import { auth } from './lib/auth.ts';

const server = createApp();

server.get("/", async () => ({ status: "Welcome Fastify!" }));
server.register(async (protectedApp) => {
  //await protectedApp.register(authMiddleware);

  protectedApp.register(tasksRoutes, { prefix: "/tasks" });
}, { prefix: "/api/v1" });

// for auth routes
server.route({
  method: ["GET", "POST"],
  url: "/api/auth/*",
  async handler(request, reply) {
    try {
      const url = new URL(request.url, `http://${request.headers.host}`);
      const headers = new Headers();

      for (const [key, value] of Object.entries(request.headers)) {
        if (value) headers.append(key, String(value));
      }

      const response = await auth.handler(
        new Request(url, {
          method: request.method,
          headers,
          body: request.body ? JSON.stringify(request.body) : null,
        }),
      );

      reply.status(response.status);
      response.headers.forEach((value, key) => reply.header(key, value));

      const type = response.headers.get("content-type");
      reply.send(
        type?.includes("application/json")
          ? await response.json()
          : await response.text(),
      );
    } catch (err) {
      request.log.error({ err }, "Auth handler error");
      reply.status(500).send({ error: "Auth internal error" });
    }
  },
});


const main = async () => {
  try {
    await server.listen({ port: env.PORT });
    console.log(`🚀 Server listening at http://${env.HOST}:${env.PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

process.on("SIGINT", async () => {
  console.log("🛑 Shutting down...");
  await server.close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("🛑 Server terminated...");
  await server.close();
  process.exit(0);
});

main();
