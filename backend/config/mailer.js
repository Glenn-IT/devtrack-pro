const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendPasswordResetEmail = async (to, resetLink) => {
  await transporter.sendMail({
    from: `"DevTrack Pro" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset your DevTrack Pro password",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #042630;">Reset your password</h2>
        <p style="color: #333;">We received a request to reset your DevTrack Pro password. Click the button below to choose a new one. This link expires in 30 minutes.</p>
        <p style="margin: 24px 0;">
          <a href="${resetLink}" style="background: #4c7273; color: #fff; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 600;">
            Reset Password
          </a>
        </p>
        <p style="color: #888; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
};

module.exports = { sendPasswordResetEmail };
