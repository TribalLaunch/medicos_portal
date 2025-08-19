import mongoose from "mongoose";
import Order from "../../../models/Order.js";

export async function updateFulfillmentFn(req, res) {
  try {
    const { orderId, fulfillmentId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(orderId))
      return res.status(400).json({ message: "Invalid orderId" });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const f = order.fulfillments.id(fulfillmentId);
    if (!f) return res.status(404).json({ message: "Fulfillment not found" });

    const fields = [
      "items",
      "carrier",
      "serviceLevel",
      "trackingNumber",
      "trackingUrl",
      "labelUrl",
      "status",
      "shippingCost",
      "weight",
      "dimensions",
      "fromAddress",
      "toAddress",
      "shippedAt",
      "deliveredAt",
    ];
    fields.forEach((k) => {
      if (req.body[k] !== undefined) f[k] = req.body[k];
    });

    if (f.status === "labeled" && order.status === "processing")
      order.status = "shipped";
    if (f.status === "delivered") {
      const allDelivered = order.fulfillments.every(
        (x) => x.status === "delivered"
      );
      if (allDelivered) order.status = "completed";
    }

    await order.save();
    res.json(f);
  } catch (err) {
    console.error("Update fulfillment error:", err);
    res.status(500).json({ message: "Failed to update fulfillment" });
  }
}
