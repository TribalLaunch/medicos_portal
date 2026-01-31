// src/routes/orders/orders.routes.js
import { Router } from "express";
import {
  listOrders,
  getOrder,
  createOrder,
  createFulfillment,
  listFulfillments,
  getFulfillment,
  updateFulfillment,
  deleteFulfillment,
  getOrderReceipt,
} from "./orders.controller.js";
import {
  requireCustomer,
  requireSales,
  requireAdmin,
  requireAuth,
} from "../../middleware/auth.js";

const r = Router();
// Use exact customer role if you don't want admins to hit these customer endpoints:
r.get("/", requireCustomer, listOrders);
r.get("/:id", requireCustomer, getOrder);

// Optional manual create (PO) — Allow sales and admin to create an order
// Assumes: payment is being handled off application
r.post("/", requireSales, createOrder);

r.post("/:orderId/fulfillment", requireAdmin, createFulfillment);
r.get("/:orderId/fulfillment", requireAdmin, listFulfillments);
r.get("/:orderId/fulfillment/:fulfillmentId", requireAdmin, getFulfillment);
r.get("/:orderId/receipt", requireAuth(), getOrderReceipt);
r.patch(
  "/:orderId/fulfillment/:fulfillmentId",
  requireAdmin,
  updateFulfillment,
);
r.delete(
  "/:orderId/fulfillment/:fulfillmentId",
  requireAdmin,
  deleteFulfillment,
);

export default r;
