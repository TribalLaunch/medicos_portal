import bcrypt from "bcryptjs";
import User from "../../../models/User.js";
import PasswordResetToken from "../../../models/PasswordResetToken.js";

export async function resetPasswordFn({ rawToken, newPassword }) {
  if (!rawToken) throw new Error("Invalid token");

  // Find a matching, unexpired, unused token
  const tokens = await PasswordResetToken.find({
    usedAt: null,
    expiresAt: { $gt: new Date() },
  })
    .sort({ createdAt: -1 })
    .lean(); // small set overall

  // Check candidate tokens by bcrypt.compare (token is hashed in DB)
  let tokenDoc = null;
  for (const t of tokens) {
    const matches = await bcrypt.compare(rawToken, t.tokenHash);
    if (matches) {
      tokenDoc = t;
      break;
    }
  }
  if (!tokenDoc) throw new Error("Token invalid or expired");

  // Update the user's password
  const user = await User.findById(tokenDoc.userId);
  if (!user) throw new Error("User not found");
  user.passwordHash = await bcrypt.hash(newPassword, 10);
  user.mustChangePassword = false;
  user.tempPasswordIssuedAt = null;
  await user.save();

  // Mark token as used (single-use)
  await PasswordResetToken.findByIdAndUpdate(tokenDoc._id, {
    $set: { usedAt: new Date() },
  });

  return { ok: true };
}
