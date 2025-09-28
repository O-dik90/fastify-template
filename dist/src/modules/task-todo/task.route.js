async function taskRoutes(app) {
    app.get("/tasks", async (request, reply) => {
        return reply.send({ tasks: "Hello task" });
    });
}
export default taskRoutes;
//# sourceMappingURL=task.route.js.map