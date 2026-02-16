import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import config from "../config/env.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, config.jwtSecret);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;   // 🧠 now this is a REAL database user
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
