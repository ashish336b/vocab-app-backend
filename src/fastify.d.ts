import { Prisma, User } from '@prisma/client';
import { Config } from './plugins/config';
import { prisma } from './core/db/db';

declare module 'fastify' {
  interface FastifyInstance {
    config: Config;
  }
  interface Session {
    authUser?: Awaited<ReturnType<typeof prisma.user.findFirst>>;
    [key: string]: any;
  }
}
