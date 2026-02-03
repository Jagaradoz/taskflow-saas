// Libraries
import type { Request, Response, NextFunction } from "express";

// Local
import { pool } from "../config/db.js";
import { UnauthorizedError } from "../utils/errors.js";
import type { RequestUser } from "../types/index.js";
import "../types/express.js";

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      throw new UnauthorizedError("Not authenticated");
    }

    const result = await pool.query<{
      id: string;
      email: string;
      name: string;
    }>("SELECT id, email, name FROM users WHERE id = $1", [userId]);

    const user = result.rows[0];
    if (!user) {
      req.session.destroy(() => {});
      throw new UnauthorizedError("User not found");
    }

    const requestUser: RequestUser = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    req.user = requestUser;
    next();
  } catch (error) {
    next(error);
  }
};
