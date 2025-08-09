// src/routes/health/health.routes.js
import { Router } from "express";
import { health } from "./controller.js";
const r = Router();
r.get("/", health);
export default r;
