// src/routes/admin/admin.routes.js
import { Router } from "express";
import {
  upsertProduct,
  listOrdersAdmin,
  updateOrderStatus,
  getProductUploadUrl,
  deleteProductImage,
} from "./admin.controller.js";
import { requireAdmin } from "../../middleware/auth.js";

const r = Router();
r.post("/products", requireAdmin, upsertProduct);
r.get("/orders", requireAdmin, listOrdersAdmin);
r.patch("/orders/:id/status", requireAdmin, updateOrderStatus);
r.post("/products/upload-url", requireAdmin, getProductUploadUrl);
r.delete("/products/image", requireAdmin, deleteProductImage);
export default r;
