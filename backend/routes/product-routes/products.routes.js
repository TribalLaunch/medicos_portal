// src/routes/products/products.routes.js
import { Router } from "express";
import { listProducts, getProduct } from "./products.controller.js";
const r = Router();
r.get("/", listProducts); // public (guest OK)
r.get("/:sku", getProduct); // public
export default r;
