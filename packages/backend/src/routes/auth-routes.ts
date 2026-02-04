// Libraries
import { Router } from "express";

// Local
import { authController } from "../controllers/auth-controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", (req, res) => authController.register(req, res));
router.post("/login", (req, res) => authController.login(req, res));
router.post("/logout", authenticate, (req, res) =>
  authController.logout(req, res),
);
router.get("/me", authenticate, (req, res) => authController.me(req, res));

export { router as authRoutes };
