import { LoggerOptions, pino } from 'pino';

const loggerOptions: LoggerOptions =
  process.env.NODE_ENV === 'production'
    ? {}
    : {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        },
      };

export default pino(loggerOptions);
