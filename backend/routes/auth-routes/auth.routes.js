// src/routes/auth/auth.routes.js
import { Router } from "express";
import { register, login, me, changePassword } from "./auth.controller.js";
import { requireAuth } from "../../middleware/auth.js";
const r = Router();
r.post("/register", register);
r.post("/login", login);
r.get("/me", requireAuth(), me);
r.post("/change-password", requireAuth(), changePassword);
export default r;
