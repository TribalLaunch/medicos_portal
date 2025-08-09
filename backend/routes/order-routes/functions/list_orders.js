// src/routes/orders/functions/listOrders.js
import Order from "../../../models/Order.js";
export function listOrdersFn(user) {
  const filter =
    user.role === "admin" ? {} : { customerId: user.customerId || null };
  return Order.find(filter).sort({ createdAt: -1 }).limit(100).lean();
}
