import 'module-alias/register.js';

import { env } from "@/config/env.js";
import { createApp } from './lib/create-app.ts';
import { tasksRoutes } from './modules/task-todo/task.route.ts';
import { auth } from './lib/auth.ts';

const server = createApp();

server.register(tasksRoutes, { prefix: '/api/tasks' });
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

      const body = request.body ? JSON.stringify(request.body) : null;
      const response = await auth.handler(new Request(url, {
        method: request.method,
        headers,
        body
      }));

      reply.status(response.status);

      response.headers.forEach((value, key) => reply.header(key, value));

      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        reply.send(await response.json());
      } else {
        reply.send(await response.text());
      }

    } catch (err) {
      request.log.error({ err }, "Authentication Error");
      reply.status(500).send({
        error: "Internal authentication error",
        code: "AUTH_FAILURE",
      });
    }
  }
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
