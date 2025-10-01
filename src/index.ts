import 'module-alias/register.js';

import fastify from "fastify";
import { env } from "@/config/env.js";
import { jsonSchemaTransform, jsonSchemaTransformObject, serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import z from 'zod/v4';

const USER_SCHEMA = z.object({
  id: z.number().int().positive(),
  name: z.string().describe('The name of the user'),
});

z.globalRegistry.add(USER_SCHEMA, { id: 'User' });

const server = fastify({ logger: true });
server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'SampleApi',
      description: 'Sample backend service',
      version: '1.0.0',
    },
    servers: [],
  },
  transform: jsonSchemaTransform,
  transformObject: jsonSchemaTransformObject,
});

server.register(fastifySwaggerUI, {
  routePrefix: '/docs',
});

server.after(() => {
  server.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/users',
    schema: {
      response: {
        200: USER_SCHEMA.array(),
      },
    },
    handler: (req, res) => {
      res.send([]);
    },
  });
});


const main = async () => {
  try {
    await server.listen({ port: env.PORT });
    console.log(`🚀 Server listening at http://${env.HOST}:${env.PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

main();
