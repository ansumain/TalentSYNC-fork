import pino from "pino";

const isDevEnvironment = process.env.NODE_ENV !== "production";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",

  transport: isDevEnvironment
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      }
    : undefined,

  base: {
    service: process.env.SERVICE_NAME,
  },

  timestamp: pino.stdTimeFunctions.isoTime,
});