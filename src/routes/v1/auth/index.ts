import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';

export const auth: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get('/', (request: FastifyRequest, reply: FastifyReply) => {
    return 'eh';
  });
};
