// src/routes/admin/functions/createSalesUser.js
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../../../models/User.js";
import { getTransporter } from "../../../services/mailer.js";
import { config } from "../../../config/env.js";

function genTempPassword() {
  // Simple, readable temp password (e.g., Ab7-xy9Kq)
  const part = () => Math.random().toString(36).slice(2, 6);
  return `${part()}-${part()}`;
}

export async function createSalesUserFn({ email, sendEmail = true, name }) {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("Email already in use");

  const tempPassword = genTempPassword();
  const passwordHash = await bcrypt.hash(tempPassword, 10);

  const user = await User.create({
    email,
    name,
    passwordHash,
    role: "sales",
    mustChangePassword: true,
    tempPasswordIssuedAt: new Date(),
  });

  if (sendEmail) {
    try {
      const t = getTransporter();
      const html = `
        <p>Welcome to Medicos!</p>
        <p>Your temporary password: <b>${tempPassword}</b></p>
        <p>Please log in and change it immediately.</p>
        <p>Portal: ${config.clientUrl}</p>
      `;
      await t.sendMail({
        to: email,
        from: config.smtp.from,
        subject: "Your Medicos Sales Account",
        html,
      });
    } catch (e) {
      // Non-fatal: admin can still copy temp password from response
      console.error("Email send failed", e);
    }
  }

  return { id: user._id, email: user.email, tempPassword };
}
