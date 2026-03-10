import * as winston from 'winston';
import { env } from '../env';

// Create custom logger that wraps the winston logger
export const winstonLogger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(
          ({ timestamp, level, message }) =>
            `${timestamp} | ${level} | ${message}`
        )
      ),
    }),
  ],
});

// Export wrapped logger with helper - forwards meta to winston
export const logger = {
  ...winstonLogger,
  debug: (message: string, meta?: object) => {
    winstonLogger.debug(message, meta);
  },
  info: (message: string, meta?: object) => {
    winstonLogger.info(message, meta);
  },
  warn: (message: string, meta?: object) => {
    winstonLogger.warn(message, meta);
  },
  error: (message: string, meta?: object) => {
    winstonLogger.error(message, meta);
  },
};
