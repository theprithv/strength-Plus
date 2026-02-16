import nodemailer from "nodemailer";

/**
 * Send a password reset email to the user.
 * @param {string} email - Recipient email
 * @param {string} resetToken - The plain-text reset token
 */
export const sendResetEmail = async (email, resetToken) => {
  // 1. Create a transporter
  // In production, you would use a real service like SendGrid, Mailgun, or Gmail.
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 2. Define the reset link (point to your frontend)
  const resetLink = `${process.env.CLIENT_URL || "http://localhost:5173"}/login?token=${resetToken}`;

  // 3. Email contents
  const mailOptions = {
    from: `"StrengthPlus Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Strength+ Password Reset Request",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #38bdf8;">Strength+</h2>
        <p>You requested a password reset for your Strength+ account.</p>
        <p>Click the button below to set a new password. This link is valid for 1 hour.</p>
        <div style="margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #38bdf8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
        </div>
        <p style="color: #6b7280; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #9ca3af; font-size: 12px;">Strength+ — Precision Strength Tracking</p>
      </div>
    `,
  };

  // 4. Send the email
  await transporter.sendMail(mailOptions);
};

/**
 * Send an OTP verification email to the user.
 * @param {string} email - Recipient email
 * @param {string} otp - The 6-digit OTP
 */
export const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"StrengthPlus Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your Strength+ Account email address",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #333; line-height: 1.5;">
        <h2 style="font-size: 24px; font-weight: 600; color: #000; margin-bottom: 24px; letter-spacing: -0.02em;">Verify your Strength+ Account email address</h2>
        
        <p style="font-size: 16px; margin-bottom: 24px;">
          You've chosen this email address for your Strength+ Account. To verify this email address belongs to you, enter the code below on the email verification page:
        </p>

        <div style="margin: 35px 0; font-size: 38px; font-weight: 700; color: #000; letter-spacing: 4px;">
          ${otp}
        </div>

        <p style="font-size: 16px; margin-bottom: 35px;">
          This code will expire within 5 minutes after this email was sent.
        </p>

        <h3 style="font-size: 16px; font-weight: 600; color: #000; margin: 0 0 8px 0;">Why you received this email.</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 24px 0;">
          Strength+ requires verification whenever an email address is selected for a Strength+ Account. Your Strength+ Account cannot be used until you verify it.
        </p>

        <p style="font-size: 14px; color: #666; margin: 0 0 40px 0;">
          If you did not make this request, you can ignore this email. No Strength+ Account will be created without verification.
        </p>

        <div style="border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #999;">
          Strength+ — Precision Strength Tracking
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
