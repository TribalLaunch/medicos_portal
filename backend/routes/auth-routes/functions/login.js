// src/routes/auth/functions/login.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../../models/User.js";
import { config } from "../../../config/env.js";

export async function loginFn({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new Error("Invalid credentials");
  const token = jwt.sign(
    { id: user._id, role: user.role, customerId: user.customerId ?? null },
    config.jwtSecret,
    { expiresIn: "7d" }
  );
  return {
    token,
    role: user.role,
    mustChangePassword: !!user.mustChangePassword,
  };
}
