import Fastify, { FastifyInstance } from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

export function createApp(): FastifyInstance {
  const app = Fastify({
    disableRequestLogging: true,
    logger: true,
    exposeHeadRoutes: false,
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
        security: [{ bearerAuth: [] }],
      },
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
