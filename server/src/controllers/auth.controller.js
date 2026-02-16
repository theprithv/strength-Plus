import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import { sendResetEmail, sendOTPEmail } from "../utils/emailService.js";
import { generateOTP, hashOTP, compareOTP } from "../utils/otpUtils.js";
import config from "../config/env.js";
import logger from "../config/logger.js";

const client = new OAuth2Client(config.googleClientId);

function safeUser(user) {
  if (!user) return null;
  const { password: _, passwordResetToken: __, passwordResetExpires: ___, ...rest } = user;
  return rest;
}

// Register a new user
export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    const trimmedEmail = String(email).trim().toLowerCase();
    const displayName = name && String(name).trim() ? String(name).trim() : trimmedEmail.split("@")[0];

    const exists = await prisma.user.findUnique({ where: { email: trimmedEmail } });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 12); // Production-level hashing

    const user = await prisma.user.create({
      data: { 
        email: trimmedEmail, 
        password: hashed, 
        name: displayName,
        isVerified: false // Explicitly set false
      }
    });

    // Log for debug (OTP will be sent via separate call or automatically)
    logger.info(`[AUTH] New user registered: ${trimmedEmail}. Awaiting verification.`);

    // Initialize Profile for manual registration too
    await prisma.profile.create({
      data: {
        userId: user.id,
        name: user.name,
        goal: "General Fitness",
        age: 18,
        height: 0,
        weight: 0,
      }
    });

    // We don't log them in yet, they need to verify
    // But we still return user info for the UI to know who to verify
    res.json({ 
      message: "Registration successful. Please verify your email.",
      user: safeUser(user) 
    });
  } catch (err) {
    logger.error(`Registration error: ${err.message}`);
    res.status(500).json({ message: "Registration failed" });
  }
};

// Login an existing user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const trimmedEmail = String(email).trim().toLowerCase();

    const user = await prisma.user.findUnique({ where: { email: trimmedEmail } });
    
    // Generic error message for security (prevents user enumeration)
    const genericMsg = "Invalid email or password";

    if (!user) return res.status(401).json({ message: genericMsg });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: genericMsg });

    const token = jwt.sign({ id: user.id }, config.jwtSecret, { expiresIn: "7d" });

    res.json({ token, user: safeUser(user) });
  } catch (err) {
    logger.error(`Login error: ${err.message}`);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Security: Always respond with success even if user doesn't exist
    if (!user) {
      return res.json({ message: "If an account exists with that email, a reset link has been sent." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: hashedToken,
        passwordResetExpires: new Date(Date.now() + 3600000), // 1 hour
      },
    });

    // 🚀 Send the real email
    try {
      // Log token for development/debugging
      if (config.isDev) logger.debug(`[DEBUG] Password reset token: ${resetToken}`);
      await sendResetEmail(user.email, resetToken);
    } catch (emailErr) {
      logger.error(`Email sending failed: ${emailErr.message}`);
      // We don't want to fail the whole request if email fails to SEND, 
      // but in production you'd want to handle this.
    }

    res.json({ 
      message: "If an account exists with that email, a reset link has been sent.",
    });
  } catch (err) {
    logger.error(`Forgot password error: ${err.message}`);
    res.status(500).json({ message: "Failed to process request" });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: { gt: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    res.json({ message: "Password updated successfully. You can now log in." });
  } catch (err) {
    logger.error(`Reset password error: ${err.message}`);
    res.status(500).json({ message: "Failed to reset password" });
  }
};

// Google Login (Access Token Flow)
export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    
    // 1. Fetch User Info from Google
    const googleRes = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
    const payload = await googleRes.json();

    if (!payload.email) {
      return res.status(400).json({ message: "Failed to retrieve user info from Google" });
    }

    const { sub: googleId, email, name, picture } = payload;
    const trimmedEmail = email.toLowerCase();

    // 2. Find or Create User
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { googleId: googleId },
          { email: trimmedEmail }
        ]
      }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: trimmedEmail,
          name: name || trimmedEmail.split("@")[0],
          googleId: googleId,
          isVerified: true // Google users are pre-verified
        }
      });
      
      // Initialize Profile
      await prisma.profile.create({
        data: {
          userId: user.id,
          name: user.name,
          goal: "General Fitness",
          age: 0,
          height: 0,
          weight: 0,
          imageUrl: picture
        }
      });
    } else if (!user.googleId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId: googleId, isVerified: true }
      });
    }

    // 3. Generate JWT
    const jwtToken = jwt.sign({ id: user.id }, config.jwtSecret, { expiresIn: "7d" });
    res.json({ token: jwtToken, user: safeUser(user) });
  } catch (err) {
    logger.error(`Google Login Error: ${err.message}`);
    res.status(500).json({ message: "Google authentication failed" });
  }
};

// --- OTP Logic ---

/**
 * Request a new OTP for email verification.
 * POST /auth/send-otp
 */
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });
    
    const trimmedEmail = String(email).trim().toLowerCase();

    // 1. Rate Limiting: Max 3 requests per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const otpCount = await prisma.otp.count({
      where: {
        email: trimmedEmail,
        createdAt: { gte: oneHourAgo }
      }
    });

    if (otpCount >= 3) {
      return res.status(429).json({ message: "OTP request limit reached. Please wait an hour before requesting a new code." });
    }

    // 2. Resend Cooldown: 60 seconds
    const lastOtp = await prisma.otp.findFirst({
      where: { email: trimmedEmail },
      orderBy: { createdAt: 'desc' }
    });

    if (lastOtp && (Date.now() - new Date(lastOtp.createdAt).getTime() < 60000)) {
      return res.status(429).json({ message: "Please wait 60 seconds before requesting a new OTP." });
    }

    // 3. Generate and Hash OTP
    const otp = generateOTP();
    const hashedOtp = await hashOTP(otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // 4. Update/Create OTP record (invalidate old ones)
    await prisma.otp.deleteMany({ where: { email: trimmedEmail } });
    await prisma.otp.create({
      data: {
        email: trimmedEmail,
        otp: hashedOtp,
        expiresAt
      }
    });

    // 5. Send Email
    logger.info(`[AUTH] Sending OTP ${otp} to ${trimmedEmail}`);
    await sendOTPEmail(trimmedEmail, otp);

    res.json({ message: "Verification code sent to your email" });
  } catch (err) {
    logger.error(`Send OTP error: ${err.message}`);
    res.status(500).json({ message: "Failed to send verification code" });
  }
};

/**
 * Verify the OTP provided by the user.
 * POST /auth/verify-otp
 */
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

    const trimmedEmail = String(email).trim().toLowerCase();

    // 1. Find OTP record
    const otpRecord = await prisma.otp.findFirst({
      where: { email: trimmedEmail }
    });

    if (!otpRecord) {
      return res.status(400).json({ message: "No active verification code found for this email" });
    }

    // 2. Check Expiration
    if (new Date() > otpRecord.expiresAt) {
      await prisma.otp.delete({ where: { id: otpRecord.id } });
      return res.status(400).json({ message: "Verification code has expired. Please request a new one." });
    }

    // 3. Check Attempt Count (max 5)
    if (otpRecord.attemptsCount >= 5) {
      await prisma.otp.delete({ where: { id: otpRecord.id } });
      return res.status(400).json({ message: "Too many failed attempts. Please request a new code." });
    }

    // 4. Verify Code
    const isValid = await compareOTP(otp, otpRecord.otp);
    if (!isValid) {
      await prisma.otp.update({
        where: { id: otpRecord.id },
        data: { attemptsCount: { increment: 1 } }
      });
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // 5. Success: Activate User
    const user = await prisma.user.update({
      where: { email: trimmedEmail },
      data: { isVerified: true }
    });

    // Clean up
    await prisma.otp.delete({ where: { id: otpRecord.id } });

    // Generate JWT for immediate login
    const token = jwt.sign({ id: user.id }, config.jwtSecret, { expiresIn: "7d" });

    res.json({ 
      message: "Email verified successfully!",
      token,
      user: safeUser(user)
    });
  } catch (err) {
    logger.error(`Verify OTP error: ${err.message}`);
    res.status(500).json({ message: "Verification failed" });
  }
};


