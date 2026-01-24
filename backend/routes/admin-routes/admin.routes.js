// src/routes/admin/admin.routes.js
import { Router } from "express";
import {
  upsertProduct,
  listOrdersAdmin,
  updateOrderStatus,
  getProductUploadUrl,
  createSalesUser,
  assignSalesToCustomer,
  unassignSalesFromCustomer,
  addProductImage,
  removeProductImage,
  listCustomers,
  upsertPriceContract,
  getPriceContracts,
  getCustomer,
  addCustomerAddress,
  deleteCustomerAddress,
} from "./admin.controller.js";
import { requireAdmin, requireSales } from "../../middleware/auth.js";

const r = Router();
r.post("/products", requireAdmin, upsertProduct);
r.get("/orders", requireAdmin, listOrdersAdmin);
r.patch("/orders/:id/status", requireAdmin, updateOrderStatus);
r.post("/products/upload-url", requireAdmin, getProductUploadUrl);
r.post("/users/sales", requireAdmin, createSalesUser);
r.get("/customers", requireSales, listCustomers);
r.get("/customers/:id", requireSales, getCustomer);
r.post("/customers/:id/addresses", requireAdmin, addCustomerAddress);
r.delete(
  "/customers/:id/addresses/:addrId",
  requireAdmin,
  deleteCustomerAddress
);
r.post("/customers/assign-sales", requireAdmin, assignSalesToCustomer);
r.post("/customers/unassign-sales", requireAdmin, unassignSalesFromCustomer);
r.post("/products/:productId/image", requireAdmin, addProductImage);
r.delete("/products/image", requireAdmin, removeProductImage);
r.get("/price-contracts", requireAdmin, getPriceContracts);
r.post("/price-contracts", requireAdmin, upsertPriceContract);
export default r;
