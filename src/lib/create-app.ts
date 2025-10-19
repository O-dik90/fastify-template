import Fastify, { FastifyInstance } from "fastify";
import { jsonSchemaTransform, jsonSchemaTransformObject, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyCors from "@fastify/cors";

export function createApp(): FastifyInstance {
  const app = Fastify({
    disableRequestLogging: true,
    logger: true,
    exposeHeadRoutes: true,
  });

  app.register(fastifyCors, {
    origin: "http://localhost:4000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With"
    ],
    credentials: true,
    maxAge: 86400
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Fastify API",
        description: "Fastify API with Zod + OpenAPI",
        version: "1.0.0",
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description: "Enter token as: Bearer <jwt>",
          },
        },
      },
      security: [{ bearerAuth: [] }], // -> apply global security
    },
    transform: jsonSchemaTransform,
    transformObject: jsonSchemaTransformObject
  });

  app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
    }
  });

  return app;
}