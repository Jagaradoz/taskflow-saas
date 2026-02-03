// Libraries
import bcrypt from "bcrypt";

// Local
import { userRepository } from "../repositories/UserRepository.js";
import { ValidationError, UnauthorizedError } from "../utils/errors.js";
import type { RegisterInput, LoginInput } from "../validators/auth.schema.js";

const SALT_ROUNDS = 12;

export const authService = {
  async register(input: RegisterInput) {
    const existingUser = await userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new ValidationError("Email already registered");
    }

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

    const user = await userRepository.create({
      email: input.email,
      passwordHash,
      name: input.name,
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  },

  async login(input: LoginInput) {
    const user = await userRepository.findByEmail(input.email);
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isValid = await bcrypt.compare(input.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  },

  async getCurrentUser(userId: string) {
    const user = await userRepository.findByIdWithMemberships(userId);
    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    return user;
  },
};
