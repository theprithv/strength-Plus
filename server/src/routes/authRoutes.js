import express from "express";
import { register, login, forgotPassword, resetPassword, googleLogin } from "../controllers/authController.js";
import { validateRegister, validateLogin, validateForgotPassword, validateResetPassword } from "../middlewares/authValidator.js";
import { authRateLimiter, passwordResetLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/register", authRateLimiter, validateRegister, register);
router.post("/login", authRateLimiter, validateLogin, login);
router.post("/forgot-password", passwordResetLimiter, validateForgotPassword, forgotPassword);
router.post("/reset-password", authRateLimiter, validateResetPassword, resetPassword);
router.post("/google", authRateLimiter, googleLogin);

export default router;