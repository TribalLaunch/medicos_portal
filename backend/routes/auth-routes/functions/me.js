// src/routes/auth/functions/me.js
import User from "../../../models/User.js";
export function meFn(userId) {
  return User.findById(userId).select("-passwordHash").lean();
}
