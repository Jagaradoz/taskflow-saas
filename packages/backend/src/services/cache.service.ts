// Third-party
import type { Redis } from "ioredis";

// Config
import { logger } from "../config/logger.config.js";
import { redis } from "../config/redis.config.js";

const DEFAULT_TTL = 300; // 5 minutes

class CacheService {
  private client: Redis;

  constructor(redisClient: Redis) {
    this.client = redisClient;
  }

  /**
   * Get a cached value by key
   */
  async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    if (!data) return null;

    try {
      return JSON.parse(data) as T;
    } catch {
      logger.warn({ key }, "Failed to parse cached value, treating as miss");
      return null;
    }
  }

  /**
   * Set a cached value with optional TTL
   */
  async set(
    key: string,
    data: unknown,
    ttlSeconds = DEFAULT_TTL,
  ): Promise<void> {
    await this.client.set(key, JSON.stringify(data), "EX", ttlSeconds);
  }

  /**
   * Delete a specific cache key
   */
  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  /**
   * Delete all keys matching a pattern (e.g., "members:*")
   * Use sparingly as SCAN can be slow on large datasets
   */
  async delPattern(pattern: string): Promise<void> {
    const stream = this.client.scanStream({ match: pattern, count: 100 });
    const pending: Promise<number>[] = [];

    stream.on("data", (keys: string[]) => {
      if (keys.length > 0) {
        pending.push(this.client.del(...keys));
      }
    });

    return new Promise((resolve, reject) => {
      stream.on("end", () => {
        Promise.all(pending).then(() => resolve(), reject);
      });
      stream.on("error", reject);
    });
  }
}

// Cache key builders
export const cacheKeys = {
  user: (userId: string) => `user:${userId}`,
  members: (orgId: string) => `members:${orgId}`,
  tasks: (orgId: string) => `tasks:${orgId}`,
};

// TTL constants (in seconds)
export const cacheTTL = {
  user: 300, // 5 minutes
  members: 300, // 5 minutes
  tasks: 300, // 5 minutes
};

export const cacheService = new CacheService(redis);
