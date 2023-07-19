import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { OAuth, OAuthIssuer } from '../../../core/oauth/oauth';
import { getUser } from '../../../services/auth/callback.service';

export const oAuthCallback: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get('/callback', async (request, reply) => {
    const oauth = new OAuth(OAuthIssuer.GOOGLE, {
      callbackUrl: request.server.config.CALLBACK_URL,
      clientId: fastify.config.GOOGLE_CLIENT_ID,
      clientSecret: fastify.config.GOOGLE_CLIENT_SECRET,
    });

    const tokenSet = await oauth.getUserToken({
      code: (request.query as any).code,
      codeVerifier: request.session.code_verifier,
    });

    const userInfo = await oauth.getUserInfo(tokenSet.access_token as string);

    const email = userInfo.email as string;

    const user = await getUser(email);

    request.session.authUser = user;
    return reply.redirect(request.server.config.FRONTEND_REDIRECT_URL);
  });
};
