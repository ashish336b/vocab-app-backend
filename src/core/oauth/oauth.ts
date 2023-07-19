import { Issuer } from 'openid-client';
import { generators } from 'openid-client';

interface OAuthOptions {
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
}

enum ChallengeMethod {
  plain = 'plain',
  S256 = 'S256',
}

interface AuthorizationUrlOption {
  scope: string[];
  codeChallenge: string;
  challengeMethod: keyof typeof ChallengeMethod;
}

interface UserTokenOption {
  code: string;
  codeVerifier: string;
}

export enum OAuthIssuer {
  GOOGLE = 'https://accounts.google.com',
}

export class OAuth {
  private issuerUrl: string;
  private oauthOptions: OAuthOptions;
  constructor(issuerUrl: string, options: OAuthOptions) {
    this.issuerUrl = issuerUrl;
    this.oauthOptions = options;
  }

  static generateCodeverifier() {
    return generators.codeVerifier();
  }

  static generateCodeChallenge(codeVerifier: string) {
    return generators.codeChallenge(codeVerifier);
  }

  private async getClient() {
    const issuer = await Issuer.discover(this.issuerUrl);
    const client = new issuer.Client({
      client_id: this.oauthOptions.clientId,
      client_secret: this.oauthOptions.clientSecret,
    });
    return client;
  }

  async getAuthorizationUrl(options: AuthorizationUrlOption) {
    const client = await this.getClient();

    return client.authorizationUrl({
      redirect_uri: this.oauthOptions.callbackUrl,
      scope: this.prepareScope(options.scope),
      code_challenge: options.codeChallenge,
      code_challenge_method: options.challengeMethod,
    });
  }

  private prepareScope(scope: AuthorizationUrlOption['scope']) {
    if (scope && scope.length) {
      return scope.join(' ');
    }
    return 'openid';
  }

  async getUserToken(option: UserTokenOption) {
    const client = await this.getClient();
    const token = await client.callback(
      this.oauthOptions.callbackUrl,
      { code: option.code },
      { code_verifier: option.codeVerifier },
    );

    return token;
  }

  async getUserInfo(token: string) {
    const client = await this.getClient();
    return await client.userinfo(token);
  }
}
