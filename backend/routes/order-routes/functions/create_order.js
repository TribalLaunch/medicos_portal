// src/routes/orders/functions/createOrder.js
import Order from "../../../models/Order.js";
export function createOrderFn(payload) {
  return Order.create(payload);
} // for future manual PO flows
