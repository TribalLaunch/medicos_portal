import mongoose from "mongoose";
import Order from "../../../models/Order.js";

export async function listFulfillmentsFn(req, res) {
  try {
    const { orderId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(orderId))
      return res.status(400).json({ message: "Invalid orderId" });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order.fulfillments || []);
  } catch (err) {
    console.error("List fulfillments error:", err);
    res.status(500).json({ message: "Failed to list fulfillments" });
  }
}
