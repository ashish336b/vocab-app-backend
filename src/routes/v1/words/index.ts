import { FastifyInstance, FastifyPluginAsync } from 'fastify';

export const words: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get('/', async (request, reply) => {
    return { words: 'words' };
  });
};
