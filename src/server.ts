import fastify from 'fastify';
import config from './plugins/config.js';

const server = fastify({
  logger: true,
});

const PORT = process.env.PORT || 8000;

server.register(config);

server.get('/ping', async (request, reply) => {
  return 'pong\n';
});

server.listen({ port: PORT as number }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
