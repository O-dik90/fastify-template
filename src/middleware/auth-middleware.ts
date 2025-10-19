import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { auth } from "@/lib/auth.ts";
import { StatusCodes } from "http-status-codes";

const authPlugin: FastifyPluginAsync = async (server) => {
  server.addHook("preHandler", async (request, reply) => {
    try {
      const session = await auth.api.getSession({
        headers: request.headers as Record<string, string>,
      });

      if (!session?.user) {
        return reply.status(StatusCodes.UNAUTHORIZED).send({
          error: "Unauthorized",
          message: "Session expired or invalid.",
        });
      }

      (request as any).user = session.user;
    } catch (err) {
      return reply.status(StatusCodes.UNAUTHORIZED).send({
        error: "Unauthorized",
        message: "Authentication failed",
      });
    }
  });
};

export const authMiddleware = fp(authPlugin, { name: "auth-middleware" });
