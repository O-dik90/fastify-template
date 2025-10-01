import type { db } from "../src/db"; // atau path ke db-mu

declare module "fastify" {
  interface FastifyInstance {
    db: typeof db;
  }
}
