import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import { OAuth, OAuthIssuer } from '../../../core/oauth/oauth';
import { prisma } from '../../../core/db/db';

export const auth: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get('/google', async (request: FastifyRequest, reply: FastifyReply) => {
    const oauth = new OAuth(OAuthIssuer.GOOGLE, {
      callbackUrl: request.server.config.CALLBACK_URL,
      clientId: fastify.config.GOOGLE_CLIENT_ID,
      clientSecret: fastify.config.GOOGLE_CLIENT_SECRET,
    });

    const codeVerifier = OAuth.generateCodeverifier();
    request.session.set('code_verifier', codeVerifier);
    const codeChallenge = OAuth.generateCodeChallenge(codeVerifier);

    const loginUrl = await oauth.getAuthorizationUrl({
      challengeMethod: 'S256',
      codeChallenge: codeChallenge,
      scope: ['email', 'profile'],
    });

    return reply.redirect(loginUrl);
  });

  fastify.get('/get-token', async (request, reply) => {
    if (request.session.authUser) {
      const jwtPayload = request.session.authUser.id;
      const token = request.server.jwt.sign({ id: jwtPayload });
      await request.session.destroy();
      return { token };
    }

    return { message: 'not authenticated' };
  });

  fastify.get('/profile', {
    preValidation: async (request, reply, next) => {
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
