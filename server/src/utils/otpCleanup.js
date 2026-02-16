import prisma from "../config/prisma.js";

export const cleanupExpiredOTPs = async () => {
  try {
    const result = await prisma.otp.deleteMany({
      where: {
        expiresAt: { lt: new Date() }
      }
    });
    
    if (result.count > 0) {
      console.log(`[CLEANUP] Deleted ${result.count} expired OTP records.`);
    }
  } catch (err) {
    console.error("[CLEANUP] OTP cleanup error:", err);
  }
};
