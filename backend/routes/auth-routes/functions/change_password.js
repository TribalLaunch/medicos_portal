// src/routes/auth/functions/changePassword.js
import bcrypt from "bcryptjs";
import User from "../../../models/User.js";

export async function changePasswordFn({
  userId,
  currentPassword,
  newPassword,
}) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  const ok = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!ok) throw new Error("Current password incorrect");
  user.passwordHash = await bcrypt.hash(newPassword, 10);
  user.mustChangePassword = false;
  user.tempPasswordIssuedAt = null;
  await user.save();
  return { ok: true };
}
