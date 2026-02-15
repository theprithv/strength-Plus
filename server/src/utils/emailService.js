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
