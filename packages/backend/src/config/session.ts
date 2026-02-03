import session from "express-session";
import RedisStore from "connect-redis";
import { redis } from "./redis.js";

const SESSION_SECRET =
  process.env.SESSION_SECRET ?? "dev-secret-change-in-production";
const SESSION_MAX_AGE = parseInt(process.env.SESSION_MAX_AGE ?? "86400000", 10);
const IS_PRODUCTION = process.env.NODE_ENV === "production";

export const sessionMiddleware = session({
  store: new RedisStore({ client: redis }),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: "sid",
  cookie: {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
  },
});

declare module "express-session" {
  interface SessionData {
    userId?: string;
    currentOrgId?: string;
  }
}
