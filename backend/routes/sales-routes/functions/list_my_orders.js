// src/routes/sales/functions/listMyOrders.js
import Customer from "../../../models/Customer.js";
import Order from "../../../models/Order.js";

export async function listMyOrdersFn(userId) {
  const custIds = await Customer.find({ salesRepId: userId }).distinct("_id");
  if (!custIds.length) return [];
  return Order.find({ customerId: { $in: custIds } })
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();
}
