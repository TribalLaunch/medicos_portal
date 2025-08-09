// src/routes/webhooks/stripe.routes.js
import { Router } from "express";
import { stripeWebhook } from "./stripe.controller.js";
const r = Router();
r.post("/stripe", stripeWebhook); // server.js must attach raw body BEFORE this router
export default r;
