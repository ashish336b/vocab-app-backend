/// <reference types="./fastify" />

import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import config from './plugins/config';
import routes from './routes/v1';
import { logger } from './plugins/logger';
import cookie from '@fastify/cookie';
import session from '@fastify/session';
import { auth } from './routes/v1/auth';
import { oAuthCallback } from './routes/v1/auth/callback';
import jwt from '@fastify/jwt';
import cors from '@fastify/cors';

(async () => {
  const server = fastify({
    logger: logger,
    disableRequestLogging: true,
  });

  // load config
  await server.register(config);
  await server.register(cors, {
    delegator: (request, callback) => {
      // list of allowed origin
      const allowedOrigin: string[] = [];
      // TODO: allow credentials for specific endpoint only
      const origin =
        request.headers.origin && allowedOrigin.includes(request.headers.origin)
          ? request.headers.origin
          : server.config.FRONTEND_BASE_URL;

      callback(null, { origin, credentials: true });
    },
  });

  await server.register(cookie);
  await server.register(session, {
    secret: server.config.SESSION_SECRET,
    cookieName: server.config.APP_NAME + '_session',
    cookie: {
      secure: 'auto',
      path: '/',
    },
  });
  await server.register(jwt, { secret: server.config.JWT_SECRET });

  // routes
  await server.register(auth, { prefix: '/login' });
  await server.register(oAuthCallback);
  await server.register(routes, { prefix: '/api/v1' });

  server.get('/health-check', async (request: FastifyRequest, reply: FastifyReply) => {
    return { message: 'healthy' };
  });

  // termination based on events.
  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () =>
      server.close().then((err) => {
        console.log(`close application on ${signal}`);
        process.exit(err ? 1 : 0);
      }),
    );
  }

  // handle unhandledRejection on nodejs process.
  process.on('unhandledRejection', (err) => {
    console.error(err);
    server.close().then(() => {
      process.exit(1);
    });
  });

  server.listen({ port: Number(server.config.PORT) }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
    console.log(`Server ping pong at ${address}/health-check`);
  });
})();
