// src/routes/admin/functions/listOrdersAdmin.js
import Order from "../../../models/Order.js";
export function listOrdersAdminFn() {
  return Order.find({}).sort({ createdAt: -1 }).limit(200).lean();
}
