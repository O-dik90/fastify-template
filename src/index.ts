import 'module-alias/register.js';

import { env } from "@/config/env.js";
import { createApp } from './lib/create-app.ts';
import { tasksRoutes } from './modules/task-todo/task.route.ts';

const server = createApp();

server.register(tasksRoutes, { prefix: '/api/tasks' });

const main = async () => {
  try {
    await server.listen({ port: env.PORT });
    console.log(`🚀 Server listening at http://${env.HOST}:${env.PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

main();
