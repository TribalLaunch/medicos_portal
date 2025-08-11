import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../../../models/User.js";
import PasswordResetToken from "../../../models/PasswordResetToken.js";
import { getTransporter } from "../../../services/mailer.js";
import { config } from "../../../config/env.js";

const TTL_MIN = Number(process.env.PASSWORD_RESET_TOKEN_TTL_MIN || 30);

function makeRawToken() {
  // URL-safe token
  return crypto.randomBytes(32).toString("base64url");
}

export async function forgotPasswordFn({ email }) {
  // Respond 200 even if user not found (don’t leak emails)
  const user = await User.findOne({ email });
  if (!user) return { ok: true };

  // Invalidate previous active tokens for this user
  await PasswordResetToken.updateMany(
    { userId: user._id, usedAt: null, expiresAt: { $gt: new Date() } },
    { $set: { usedAt: new Date() } }
  );

  // Create new token
  const raw = makeRawToken();
  const tokenHash = await bcrypt.hash(raw, 10);
  const expiresAt = new Date(Date.now() + TTL_MIN * 60 * 1000);

  await PasswordResetToken.create({ userId: user._id, tokenHash, expiresAt });

  // Build reset URL the frontend will handle later; for now, a placeholder path
  const resetUrl = `${
    config.clientUrl
  }/reset-password?token=${encodeURIComponent(raw)}`;

  // Send email (best-effort; don’t fail the API if email fails)
  try {
    const t = getTransporter();
    const html = `
      <p>You requested a password reset for your Medicos account.</p>
      <p>This link expires in ${TTL_MIN} minutes.</p>
      <p><a href="${resetUrl}">Reset your password</a></p>
      <p>If you did not request this, you can ignore this email.</p>
    `;
    await t.sendMail({
      to: email,
      from: config.smtp.from,
      subject: "Reset your Medicos password",
      html,
    });
  } catch (e) {
    console.error("Password reset email failed:", e.message);
  }

  return { ok: true };
}
