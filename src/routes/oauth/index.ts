import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import { OAuth, OAuthIssuer } from '../../core/oauth/oauth';
import { getUser } from '../../services/auth/callback.service';

export const oauth: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get('/google', async (request: FastifyRequest, reply: FastifyReply) => {
    const oauth = new OAuth(OAuthIssuer.GOOGLE, {
      clientId: fastify.config.GOOGLE_CLIENT_ID,
      clientSecret: fastify.config.GOOGLE_CLIENT_SECRET,
      callbackUrl: request.server.config.CALLBACK_URL,
    });

    const codeVerifier = OAuth.generateCodeverifier();
    request.session.set('code_verifier', codeVerifier);
    const codeChallenge = OAuth.generateCodeChallenge(codeVerifier);

    const loginUrl = await oauth.getAuthorizationUrl({
      challengeMethod: 'S256',
      codeChallenge: codeChallenge,
      scope: ['email', 'profile'],
    });
    console.log(loginUrl);
    return reply.redirect(loginUrl);
  });

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
