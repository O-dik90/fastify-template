import type { FastifyReply, FastifyRequest } from "fastify";

export const newTaskController = (
  req: FastifyRequest,
  rep: FastifyReply
) => {
  return rep.send({ message: "New Task" });
}