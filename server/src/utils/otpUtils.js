import crypto from "crypto";
import bcrypt from "bcrypt";

/**
 * Generate a 6-digit numeric OTP.
 * @returns {string} 6-digit OTP
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Hash the OTP for secure storage.
 * @param {string} otp 
 * @returns {Promise<string>} Hashed OTP
 */
export const hashOTP = async (otp) => {
  return await bcrypt.hash(otp, 10);
};

/**
 * Compare plain OTP with hashed OTP.
 * @param {string} otp 
 * @param {string} hashedOtp 
 * @returns {Promise<boolean>}
 */
export const compareOTP = async (otp, hashedOtp) => {
  return await bcrypt.compare(otp, hashedOtp);
};
