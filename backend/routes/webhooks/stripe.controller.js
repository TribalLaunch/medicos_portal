// src/routes/webhooks/stripe.controller.js
import Stripe from "stripe";
import { config } from "../../config/env.js";
import Order from "../../models/Order.js";

const stripe = new Stripe(config.stripeSecret);

export async function stripeWebhook(req, res) {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      config.stripeWebhookSecret
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Log to help while testing
  console.log("[Stripe] Event:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Try metadata.orderId first, then fallback to stripeSessionId
    let order = null;
    if (session.metadata?.orderId) {
      order = await Order.findById(session.metadata.orderId);
    }
    if (!order) {
      order = await Order.findOne({ stripeSessionId: session.id });
    }
    if (!order) {
      console.error(
        "[Stripe] Order not found. session.id:",
        session.id,
        "metadata.orderId:",
        session.metadata?.orderId
      );
      return res.json({ received: true }); // ack so Stripe won’t retry forever
    }
    if (order.status !== "paid") {
      order.status = "paid";
      order.payment = {
        stripeSessionId: session.id,
        paymentIntentId: session.payment_intent || null,
      };
      order.events.push("paid:webhook");
      await order.save();
      console.log("[Stripe] Order marked paid:", order._id.toString());
    }

    // Order.findOneAndUpdate(
    //   { stripeSessionId: session.id },
    //   { status: "paid", $push: { events: "paid" } }
    // ).exec();
  }
  res.json({ received: true });
}
