import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import { sendResetEmail } from "../utils/emailService.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
      data: { email: trimmedEmail, password: hashed, name: displayName }
    });

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

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, user: safeUser(user) });
  } catch (err) {
    console.error("Registration error:", err);
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

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, user: safeUser(user) });
  } catch (err) {
    console.error("Login error:", err);
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
      console.log(`[DEBUG] Password reset token: ${resetToken}`);
      await sendResetEmail(user.email, resetToken);
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
      // We don't want to fail the whole request if email fails to SEND, 
      // but in production you'd want to handle this.
    }

    res.json({ 
      message: "If an account exists with that email, a reset link has been sent.",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
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
    console.error("Reset password error:", err);
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
        data: { googleId: googleId }
      });
    }

    // 3. Generate JWT
    const jwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token: jwtToken, user: safeUser(user) });
  } catch (err) {
    console.error("Google Login Error:", err);
    res.status(500).json({ message: "Google authentication failed" });
  }
};


