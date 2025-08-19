import mongoose from "mongoose";
import Order from "../../../models/Order.js";

export async function deleteFulfillmentFn(req, res) {
  try {
    const { orderId, fulfillmentId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(orderId))
      return res.status(400).json({ message: "Invalid orderId" });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const f = order.fulfillments.id(fulfillmentId);
    if (!f) return res.status(404).json({ message: "Fulfillment not found" });

    if (["in_transit", "delivered"].includes(f.status)) {
      return res
        .status(400)
        .json({ message: "Cannot delete shipped/delivered fulfillment" });
    }

    f.deleteOne();
    await order.save();
    res.json({ ok: true });
  } catch (err) {
    console.error("Delete fulfillment error:", err);
    res.status(500).json({ message: "Failed to delete fulfillment" });
  }
}
