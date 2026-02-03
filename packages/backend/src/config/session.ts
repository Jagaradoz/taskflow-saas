// Libraries
import RedisStore from "connect-redis";
import session from "express-session";

// Local
import { env } from "./env.js";
import { redis } from "./redis.js";

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
