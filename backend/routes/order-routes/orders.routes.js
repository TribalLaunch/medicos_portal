// src/routes/orders/orders.routes.js
import { Router } from "express";
import { listOrders, getOrder, createOrder } from "./orders.controller.js";
import {
  requireCustomer,
  requireExactCustomer,
} from "../../middleware/auth.js";

const r = Router();
// Use exact customer role if you don't want admins to hit these customer endpoints:
r.get("/", requireCustomer, listOrders);
r.get("/:id", requireCustomer, getOrder);

// Optional manual create (PO) — allow customer or sales/admin as you wish.
// Here, we allow only exact customer (no admin impersonation).
r.post("/", requireExactCustomer, createOrder);

export default r;
