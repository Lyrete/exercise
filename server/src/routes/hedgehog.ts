import {
  addHedgehog,
  getAllHedgehogs,
  getHedgehog,
} from "@server/application/hedgehog";
import { newHedgehogSchema } from "@shared/hedgehog";
import {
  FastifyInstance,
  FastifyPluginOptions,
  RouteGenericInterface,
} from "fastify";
import { z } from "zod";

export function hedgehogRouter(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
  done: () => void
) {
  fastify.get("/", async function (_request, reply) {
    const hedgehogs = await getAllHedgehogs();

    return reply.code(200).send({
      hedgehogs,
    });
  });

  // TODO: Yksittäisen siilin hakeminen tietokannasta ID:llä
  fastify.get<RouteGenericInterface & { Params: { hedgehogId: number } }>(
    "/:hedgehogId",
    async function (request, reply) {
      const { hedgehogId } = request.params;
      const hedgehog = await getHedgehog(hedgehogId);
      return reply.code(200).send(hedgehog);
    }
  );

  fastify.post("/", async function (request, reply) {
    console.log(request.body);
    const validated = newHedgehogSchema.parse(request.body);
    const newHedgehog = await addHedgehog(validated);
    return reply.code(200).send(newHedgehog);
  });

  done();
}
