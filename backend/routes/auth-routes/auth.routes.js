// src/routes/auth/auth.routes.js
import { Router } from "express";
import {
  register,
  login,
  me,
  changePassword,
  forgotPassword,
  resetPassword,
} from "./auth.controller.js";
import { requireAuth } from "../../middleware/auth.js";
const r = Router();
r.post("/register", register);
r.post("/login", login);
r.get("/me", requireAuth(), me);
// Change password (logged-in)
r.post("/change-password", requireAuth(), changePassword);
// Forgot / Reset (public)
r.post("/forgot-password", forgotPassword);
r.post("/reset-password", resetPassword);
export default r;
