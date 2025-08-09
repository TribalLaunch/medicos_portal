// src/routes/checkout/checkout.routes.js
import { Router } from "express";
import { createStripeSession } from "./checkout.controller.js";
const r = Router();
r.post("/stripe-session", createStripeSession); // guest or logged-in
export default r;
