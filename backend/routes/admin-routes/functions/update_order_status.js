// src/routes/admin/functions/updateOrderStatus.js
import Order from "../../../models/Order.js";
export function updateOrderStatusFn(id, status) {
  return Order.findByIdAndUpdate(
    id,
    { status, $push: { events: `status:${status}` } },
    { new: true }
  );
}
