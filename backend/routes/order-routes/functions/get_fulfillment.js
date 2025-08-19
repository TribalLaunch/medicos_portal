import mongoose from "mongoose";
import Order from "../../../models/Order.js";

export async function getFulfillmentFn(req, res) {
  try {
    const { orderId, fulfillmentId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(orderId))
      return res.status(400).json({ message: "Invalid orderId" });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const f = order.fulfillments.id(fulfillmentId);
    if (!f) return res.status(404).json({ message: "Fulfillment not found" });

    res.json(f);
  } catch (err) {
    console.error("Get fulfillment error:", err);
    res.status(500).json({ message: "Failed to get fulfillment" });
  }
}
