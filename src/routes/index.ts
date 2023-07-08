import { FastifyPluginAsync } from 'fastify';

const routes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/hello', async (request, response) => {
    return { ok: 'ok' };
  });
};

export default routes;
