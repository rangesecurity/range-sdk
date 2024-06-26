import { pino, stdTimeFunctions } from 'pino';

export function getLogger(args: { name: string }) {
  const logger = pino({
    name: args.name,
    timestamp: stdTimeFunctions.isoTime,
    formatters: {
      level: (label: string) => {
        return { level: label };
      },
      bindings: () => {
        return {};
      },
    },
  });

  return logger;
}
