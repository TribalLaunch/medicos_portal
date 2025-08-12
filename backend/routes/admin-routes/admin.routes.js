// src/routes/admin/admin.routes.js
import { Router } from "express";
import {
  upsertProduct,
  listOrdersAdmin,
  updateOrderStatus,
  getProductUploadUrl,
  deleteProductImage,
  createSalesUser,
  assignSalesToCustomer,
  unassignSalesFromCustomer,
  addProductImage,
  removeProductImage,
} from "./admin.controller.js";
import { requireAdmin } from "../../middleware/auth.js";

const r = Router();
r.post("/products", requireAdmin, upsertProduct);
r.get("/orders", requireAdmin, listOrdersAdmin);
r.patch("/orders/:id/status", requireAdmin, updateOrderStatus);
r.post("/products/upload-url", requireAdmin, getProductUploadUrl);
// r.delete("/products/image", requireAdmin, deleteProductImage);
r.post("/users/sales", requireAdmin, createSalesUser);
r.post("/customers/assign-sales", requireAdmin, assignSalesToCustomer);
r.post("/customers/unassign-sales", requireAdmin, unassignSalesFromCustomer);
r.post("/products/image", requireAdmin, addProductImage);
r.delete("/products/image", requireAdmin, removeProductImage);
export default r;
