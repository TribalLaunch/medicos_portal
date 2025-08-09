// src/routes/webhooks/stripe.controller.js
import Stripe from "stripe";
import { config } from "../../config/env.js";
import Order from "../../models/Order.js";

const stripe = new Stripe(config.stripeSecret);

export function stripeWebhook(req, res) {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      config.stripeWebhookSecret
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    Order.findOneAndUpdate(
      { stripeSessionId: session.id },
      { status: "paid", $push: { events: "paid" } }
    ).exec();
  }
  res.json({ received: true });
}
