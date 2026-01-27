import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { getMyCustomer } from "./customer.contoller.js";

const r = Router();

/**
 * Current customer profile for checkout flows
 */
r.get("/me", requireAuth(), getMyCustomer);

export default r;
