import fastify from "fastify";
import taskRoutes from "@src/modules/task-todo/task.route.js";
const server = fastify({ logger: true });
server.get("/", async (request, reply) => {
    return { hello: "world" };
});
const main = async () => {
    server.register(taskRoutes, { prefix: "/api/tasks" });
    try {
        await server.listen({ port: 3000 });
        console.log("Server listening on http://localhost:3000");
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};
main();
//# sourceMappingURL=index.js.map