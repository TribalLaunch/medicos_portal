// src/routes/sales/sales.routes.js
import { Router } from "express";
import { requireSales } from "../../middleware/auth.js";
import { listMyCustomers, listMyOrders } from "./sales.controller.js";

const r = Router();
r.get("/customers", requireSales, listMyCustomers);
r.get("/orders", requireSales, listMyOrders);
export default r;
