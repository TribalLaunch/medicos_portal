import mongoose from "mongoose";
import Order from "../../../models/Order.js";

export async function createFulfillmentFn(req, res) {
  try {
    const { orderId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(orderId))
      return res.status(400).json({ message: "Invalid orderId" });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const f = order.fulfillments.create({
      items: req.body.items || [], // [{ sku, qty }]
      carrier: req.body.carrier,
      serviceLevel: req.body.serviceLevel,
      status: req.body.status || "pending",
      trackingNumber: req.body.trackingNumber,
      trackingUrl: req.body.trackingUrl,
      labelUrl: req.body.labelUrl,
      shippingCost: req.body.shippingCost,
      weight: req.body.weight,
      dimensions: req.body.dimensions,
      fromAddress: req.body.fromAddress,
      toAddress: req.body.toAddress || order.shippingAddress,
      shippedAt: req.body.shippedAt,
      deliveredAt: req.body.deliveredAt,
    });

    order.fulfillments.push(f);
    if (order.status === "paid") order.status = "processing";

    await order.save();
    res.status(201).json(f);
  } catch (err) {
    console.error("Create fulfillment error:", err);
    res.status(500).json({ message: "Failed to create fulfillment" });
  }
}
