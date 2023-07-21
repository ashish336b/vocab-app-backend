import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../../core/db/db';
import httpStatus from 'http-status-codes';

export const auth: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get('/get-token', async (request: FastifyRequest, reply: FastifyReply) => {
    if (request.session.authUser) {
      const jwtPayload = request.session.authUser.id;
      const token = request.server.jwt.sign({ id: jwtPayload });
      await request.session.destroy();
      return { token };
    }

    return reply.code(httpStatus.UNAUTHORIZED).send({ message: 'unauthorized' });
  });

  fastify.get('/profile', {
    preValidation: async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch (error) {
        reply.send(error);
      }
    },
    handler: async function (request, reply) {
      const id = (request.user as any).id as number;
      const user = await prisma.user.findFirst({ where: { id } });

      return {
        id: user?.id,
        email: user?.email,
      };
    },
  });
};
