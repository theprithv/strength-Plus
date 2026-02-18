import express from "express";
import { register, login, googleLogin } from "../controllers/auth.controller.js";
import { validateRegister, validateLogin } from "../middlewares/authValidator.js";
import { authRateLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/register", authRateLimiter, validateRegister, register);
router.post("/login", authRateLimiter, validateLogin, login);
router.post("/google", authRateLimiter, googleLogin);

export default router;