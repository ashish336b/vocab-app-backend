import fastify from 'fastify';
import config from './plugins/config';

(async () => {
  const server = fastify({
    logger: true,
    disableRequestLogging: true,
  });

  process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
  });

  await server.register(config);

  server.get('/ping', async (request, reply) => {
    return 'pong\n';
  });

  const port = +server.config.PORT;

  server.listen({ port: port as number }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
    console.log(`Server ping pong at ${address}/ping`);
  });

  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () =>
      server.close().then((err) => {
        console.log(`close application on ${signal}`);
        process.exit(err ? 1 : 0);
      }),
    );
  }
})();
