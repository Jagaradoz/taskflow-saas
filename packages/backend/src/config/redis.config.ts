// Third-party
import Redis from "ioredis";

// Config
import { env } from "./env.config.js";
import { logger } from "./logger.config.js";

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => {
    if (times > 3) {
      logger.error(
        "Redis retry limit reached (%d attempts). Connection unavailable.",
        times,
      );
      return null;
    }
    return Math.min(times * 100, 2000);
  },
});

redis.on("error", (err) => {
  logger.error("Redis connection error: %s", err.message);
});

redis.on("connect", () => {
  logger.info("Redis connected");
});
