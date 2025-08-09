// src/routes/auth/functions/register.js
import bcrypt from "bcryptjs";
import User from "../../../models/User.js";
import Customer from "../../../models/Customer.js";

export async function registerFn({
  email,
  password,
  role = "clinic",
  customerPayload,
}) {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("Email already in use");

  let customerId = null;
  if (role === "clinic" && customerPayload) {
    const c = await Customer.create({
      ...customerPayload,
      user_type: "Clinic",
    });
    customerId = c._id;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash, role, customerId });
  return { id: user._id, role: user.role, customerId };
}
