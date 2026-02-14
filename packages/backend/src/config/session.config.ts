// Third-party
import RedisStore from "connect-redis";
import session from "express-session";

// Config
import { env } from "./env.config.js";
import { redis } from "./redis.config.js";

export const sessionMiddleware = session({
  store: new RedisStore({ client: redis }),
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: "sid",
  cookie: {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: env.SESSION_MAX_AGE,
  },
});

declare module "express-session" {
  interface SessionData {
    userId?: string;
    currentOrgId?: string;
  }
}
