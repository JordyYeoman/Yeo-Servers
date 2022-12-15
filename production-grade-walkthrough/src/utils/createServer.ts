import fastify, { FastifyRegisterOptions } from "fastify";
import swagger from "@fastify/swagger";
import { todoRoute } from "../modules/todo/todo.route";
import { version } from "../../package.json";

export async function createServer() {
  const app = fastify();

  app.register(swagger, {
    routePrefix: "/docs",
    swagger: {
      host: "localhost",
      info: {
        title: "Todo",
        description: "A simple todo app",
        version,
      },
      tags: [
        {
          name: "todo",
        },
      ],
    },
    staticCSP: true,
    exposeRoute: true,
  } as FastifyRegisterOptions<any>); // TODO - fix up typing issue with FastifyRegisterOptions<SwaggerOptions>

  app.register(todoRoute, { prefix: "/api/todos" });

  return app;
}
