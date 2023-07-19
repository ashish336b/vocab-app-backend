import 'dotenv/config';
import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { Static, Type } from '@sinclair/typebox';
import Ajv from 'ajv';

const env = dotenv.config();
dotenvExpand.expand(env);

export enum NodeEnv {
  development = 'development',
  test = 'test',
  production = 'production',
}

const ConfigSchema = Type.Strict(
  Type.Object({
    APP_NAME: Type.String(),
    NODE_ENV: Type.Enum(NodeEnv),
    APP_URL: Type.String(),
    PORT: Type.String(),
    DATABASE_URL: Type.String(),
    JWT_SECRET: Type.String(),
    SESSION_SECRET: Type.String(),
    GOOGLE_CLIENT_ID: Type.String(),
    GOOGLE_CLIENT_SECRET: Type.String(),
    CALLBACK_URL: Type.String(),
    FRONTEND_REDIRECT_URL: Type.String(),
    FRONTEND_BASE_URL: Type.String(),
  }),
);

const ajv = new Ajv({
  allErrors: true,
  removeAdditional: true,
  useDefaults: true,
  coerceTypes: true,
  allowUnionTypes: true,
});

export type Config = Static<typeof ConfigSchema>;

const configPlugin: FastifyPluginAsync = async (server) => {
  const validate = ajv.compile(ConfigSchema);
  const valid = validate(process.env);
  if (!valid) {
    throw new Error('.env file validation failed - ' + JSON.stringify(validate.errors, null, 2));
  }

  server.decorate<NodeJS.ProcessEnv>('config', process.env);
};

export default fp(configPlugin);
