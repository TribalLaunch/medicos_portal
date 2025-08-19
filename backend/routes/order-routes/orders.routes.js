// src/routes/orders/orders.routes.js
import { Router } from "express";
import { listOrders, getOrder, createOrder } from "./orders.controller.js";
import { requireCustomer, requireSales } from "../../middleware/auth.js";

const r = Router();
// Use exact customer role if you don't want admins to hit these customer endpoints:
r.get("/", requireCustomer, listOrders);
r.get("/:id", requireCustomer, getOrder);

// Optional manual create (PO) — Allow sales and admin to create an order
// Assumes: payment is being handled off application
r.post("/", requireSales, createOrder);

export default r;
