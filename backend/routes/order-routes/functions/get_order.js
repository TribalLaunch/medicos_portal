// src/routes/orders/functions/getOrder.js
import Order from "../../../models/Order.js";
export function getOrderFn(id, user) {
  const filter = { _id: id };
  if (user.role !== "admin") filter.customerId = user.customerId || null;
  return Order.findOne(filter).lean();
}
