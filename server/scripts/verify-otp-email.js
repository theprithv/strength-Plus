
import { sendOTPEmail } from "../src/utils/emailService.js";
import { generateOTP } from "../src/utils/otpUtils.js";
import logger from "../src/config/logger.js";

async function testEmail() {
  const testEmail = "strength.pluss@gmail.com";
  const otp = generateOTP();

  logger.info(`Attempting to send OTP ${otp} to ${testEmail}...`);

  try {
    await sendOTPEmail(testEmail, otp);
    logger.info("✅ Email sent successfully (check your mailtrap/smtp inbox)");
  } catch (error) {
    logger.error("❌ Failed to send email:");
    logger.error(error);
  }
}

testEmail();
