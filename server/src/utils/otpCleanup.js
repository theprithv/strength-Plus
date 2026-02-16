import prisma from "../config/prisma.js";
import logger from "../config/logger.js";

export const cleanupExpiredOTPs = async () => {
  try {
    const result = await prisma.otp.deleteMany({
      where: {
        expiresAt: { lt: new Date() }
      }
    });
    
    if (result.count > 0) {
      logger.info(`[CLEANUP] Deleted ${result.count} expired OTP records.`);
    }
  } catch (err) {
    logger.error(`[CLEANUP] OTP cleanup error: ${err.message}`);
  }
};
