import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { auth } from "@/lib/auth.ts";

const authPlugin: FastifyPluginAsync = async (server) => {
  server.addHook("preHandler", async (request, reply) => {
    try {
      const session = await auth.api.getSession({
        headers: request.headers as Record<string, string>,
      });

      request.log.debug({ session }, "Auth session");

      if (!session?.user) {
        return reply.status(401).send({
          error: "Unauthorized",
          message: "Session expired or invalid.",
        });
      }

      (request as any).user = session.user;
    } catch (err) {
      request.log.error({ err }, "Auth middleware error");
      return reply.status(401).send({
        error: "Unauthorized",
        message: "Authentication failed",
      });
    }
  });
};

export const authMiddleware = fp(authPlugin, { name: "auth-middleware" });
