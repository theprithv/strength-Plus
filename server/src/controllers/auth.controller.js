import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
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

    // STRICT: Only accepts @gmail.com addresses
    if (!trimmedEmail.endsWith("@gmail.com")) {
      return res.status(400).json({ message: "Invalid email ID. Only Gmail addresses are allowed." });
    }

    const displayName = name && String(name).trim() ? String(name).trim() : trimmedEmail.split("@")[0];

    // Check existing user
    const exists = await prisma.user.findUnique({ where: { email: trimmedEmail } });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 12); // Production-level hashing

    // Create user (Verified by default as per Gmail-only rule)
    const user = await prisma.user.create({
      data: { 
        email: trimmedEmail, 
        password: hashed, 
        name: displayName,
      }
    });

    logger.info(`[AUTH] New user registered: ${trimmedEmail}.`);

    // Initialize Profile
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

    // Generate JWT immediately
    const token = jwt.sign({ id: user.id }, config.jwtSecret, { expiresIn: "7d" });

    res.status(201).json({ 
      message: "Registration successful",
      token,
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
    
    // Generic error message for security
    const genericMsg = "Invalid email or password";

    if (!user) return res.status(401).json({ message: genericMsg });

    // Allow login if password exists (even if Google ID exists, password login is valid if set)
    if (!user.password) {
       return res.status(401).json({ message: "Please log in with Google." });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: genericMsg });

    const token = jwt.sign({ id: user.id }, config.jwtSecret, { expiresIn: "7d" });

    res.json({ token, user: safeUser(user) });
  } catch (err) {
    logger.error(`Login error: ${err.message}`);
    res.status(500).json({ message: "An unexpected error occurred" });
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

    // Enforce Gmail policy
    if (!trimmedEmail.endsWith("@gmail.com")) {
      return res.status(400).json({ message: "Only Gmail accounts are allowed." });
    }

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
    const jwtToken = jwt.sign({ id: user.id }, config.jwtSecret, { expiresIn: "7d" });
    res.json({ token: jwtToken, user: safeUser(user) });
  } catch (err) {
    logger.error(`Google Login Error: ${err.message}`);
    res.status(500).json({ message: "Google authentication failed" });
  }
};


