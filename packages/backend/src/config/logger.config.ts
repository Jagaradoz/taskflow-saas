// Third-party
import pino from "pino";

// Config
import { env } from "./env.config.js";

export const logger = pino({
  level: env.NODE_ENV === "production" ? "info" : "debug",
  transport:
    env.NODE_ENV !== "production"
      ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
        },
      }
      : undefined,
});
