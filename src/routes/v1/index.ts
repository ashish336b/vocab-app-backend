import { FastifyPluginAsync } from 'fastify';
import { words } from './words';

const routes: FastifyPluginAsync = async (fastify) => {
  fastify.register(words, { prefix: 'words' });
};

export default routes;
