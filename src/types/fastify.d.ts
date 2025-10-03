import type { db } from "../src/db";
import type { AppDecorators } from "./lib/app-types";

declare module "fastify" {
  interface FastifyInstance {
    db: typeof db;
  }
}

declare module "fastify" {
  interface FastifyInstance extends AppDecorators {}
}