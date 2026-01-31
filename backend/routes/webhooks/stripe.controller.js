// src/routes/webhooks/stripe.controller.js
import Stripe from "stripe";
import { config } from "../../config/env.js";
import Order from "../../models/Order.js";

/**
 * Stripe Webhook Handler
 *
 * MUST be used with raw body middleware on the webhook route, e.g.:
 *   app.post("/api/webhooks/stripe", express.raw({ type: "application/json" }), stripeWebhook);
 *
 * This handler:
 * - Verifies webhook signature
 * - On checkout.session.completed:
 *   - finds order by session.metadata.orderId (fallback: stripeSessionId)
 *   - stores paymentIntentId
 *   - retrieves PaymentIntent to get latest_charge.id (chargeId)
 *   - marks order paid and sets paidAt
 */

const stripe = new Stripe(config.stripeSecret);

export async function stripeWebhook(req, res) {
  const sig = req.headers["stripe-signature"];
  if (!sig) {
    // Missing signature -> treat as bad request
    return res.status(400).json({ error: "Missing Stripe signature." });
  }
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      config.stripeWebhookSecret,
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Log to help while testing
  console.log("[Stripe] Event:", event.type);
  console.log("WEBHOOK EVENT: ", event);

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      console.log("META DATA: ", session.metadata);
      console.log("PI: ", session.payment_intent);

      const orderIdFromMeta = session?.metadata?.orderId || null;
      const stripeSessionId = session?.id || null;
      const paymentIntentId = session?.payment_intent || null;

      // Try metadata.orderId first, then fallback to stripeSessionId
      let order = null;
      if (orderIdFromMeta) {
        order = await Order.findById(orderIdFromMeta);
      }
      if (!order && stripeSessionId) {
        order = await Order.findOne({ stripeSessionId });
      }
      if (!order) {
        console.error(
          "[Stripe] Order not found. session.id:",
          session.id,
          "metadata.orderId:",
          session.metadata?.orderId,
        );
        return res.json({ received: true }); // ack so Stripe won’t retry forever
      }

      // If already paid, acknowledge (idempotency)
      if (order.status === "paid") {
        return res.status(200).json({ received: true });
      }

      // Save Stripe Identifiers
      if (stripeSessionId) order.payment.stripeSessionId = stripeSessionId;
      if (paymentIntentId) order.payment.paymentIntentId = paymentIntentId;

      // Retrieve Payment Intent to capture chargeId (receipt_url)
      if (paymentIntentId) {
        try {
          const pi = await stripe.paymentIntents.retrieve(paymentIntentId, {
            expand: ["latest_charge"],
          });

          const chargeId = pi?.latest_charge?.id || null;
          if (chargeId) order.payment.chargeId = chargeId;
        } catch (err) {
          console.warn(
            "[stripeWebhook] Failed to retrieve PaymentIntent:",
            err?.message || err,
          );
        }
      }

      if (order.status !== "paid") {
        order.status = "paid";
        order.events.push("paid:webhook");
        await order.save();
        console.log("[Stripe] Order marked paid:", order._id.toString());
      }
    }
    res.json({ received: true });
  } catch (err) {
    console.error("[stripeWebhook] Handler error:", err?.message || err);

    // IMPORTANT: return 200 or 500?
    // - Returning 500 causes Stripe retries.
    // - For transient DB errors, retries can be helpful.
    // - For logic errors, retries will spam.
    //
    // Safer default: return 500 so you don't silently miss updates.
    return res.status(500).json({ error: "Stripe webhook handler failed." });
  }
}
