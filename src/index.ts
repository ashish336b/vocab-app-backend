import fastify from 'fastify';
import config from './plugins/config';
import routes from './routes/v1';

(async () => {
  const server = fastify({
    logger: true,
    disableRequestLogging: true,
  });

  process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
  });

  // load config
  await server.register(config);

  // routes
  await server.register(routes, { prefix: '/api/v1' });

  server.get('/health-check', async (request, reply) => {
    return { message: 'healthy' };
  });

  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () =>
      server.close().then((err) => {
        console.log(`close application on ${signal}`);
        process.exit(err ? 1 : 0);
      }),
    );
  }

  server.listen({ port: Number(server.config.PORT) }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
    console.log(`Server ping pong at ${address}/ping`);
  });
})();
