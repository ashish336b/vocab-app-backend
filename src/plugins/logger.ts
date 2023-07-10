import pino from 'pino';

const transport = pino.transport({
  targets: [
    {
      level: 'info',
      target: 'pino-pretty',
      options: {},
    },
    {
      level: 'error',
      target: 'pino/file',
      options: { destination: './logs/error.log', mkdir: true },
    },
    {
      level: 'warn',
      target: 'pino/file',
      options: { destination: './logs/warn.log', mkdir: true },
    },
  ],
});

export const logger = pino(transport);
