// Libraries
import Redis from "ioredis";

// Local
import { env } from "./env.js";
import { logger } from "./logger.js";

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
