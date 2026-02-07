// Libraries
import type { Request, Response, NextFunction } from "express";

// Local
import { userRepository } from "../repositories/user-repository.js";
import { UnauthorizedError } from "../utils/errors.js";
import { logger } from "../config/logger.js";
import type { RequestUser } from "../types/express.js";
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

    const user = await userRepository.findById(userId);
    if (!user) {
      req.session.destroy((err) => {
        if (err) {
          logger.error({ err }, "Failed to destroy session for missing user");
        }
      });
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
