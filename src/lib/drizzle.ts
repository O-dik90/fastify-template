import db from "@/db/index.js";
import fp from "fastify-plugin";

export default fp(async (fastify) => {
  fastify.decorate("db", db);
});
