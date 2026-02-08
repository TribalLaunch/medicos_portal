// src/routes/webhooks/stripe.controller.js
import Stripe from "stripe";
import { config } from "../../config/env.js";
import Order from "../../models/Order.js";
import { recomputeInvoiceTotals } from "../../services/invoice.js";

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
  // console.log("[Stripe] Event:", event.type);
  // console.log("WEBHOOK EVENT: ", event);

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const orderIdFromMeta = session?.metadata?.orderId || null;
      const stripeSessionId = session?.id || null;
      const paymentIntentId = session?.payment_intent || null;
      const purpose = session?.metadata?.purpose || null; // "invoice_payment"
      const userId = session?.metadata?.user || null;

      // Retrieve Payment Intent to capture chargeId (receipt_url)
      let chargeId = null;
      if (paymentIntentId) {
        try {
          const pi = await stripe.paymentIntents.retrieve(paymentIntentId, {
            expand: ["latest_charge"],
          });

          chargeId = pi?.latest_charge?.id || null;
        } catch (err) {
          console.warn(
            "[stripeWebhook] Failed to retrieve PaymentIntent:",
            err?.message || err,
          );
        }
      }

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

      // ============================================================
      // BRANCH 1: INVOICE PAYMENTS (partial/full pay later)
      // ============================================================
      if (purpose === "invoice_payment" || order.paymentMethod === "invoice") {
        // We only want to treat as invoice payment if:
        // - purpose says invoice_payment
        // OR order is invoice (safe fallback)
        // But do NOT break standard one-go stripe orders.

        // Idempotency: if paymentIntent already recorded in payments array, skip
        const existing = (order.payments || []).some(
          (p) =>
            (paymentIntentId && p.stripePaymentIntentId === paymentIntentId) ||
            (stripeSessionId && p.stripeSessionId === stripeSessionId),
        );

        if (!existing) {
          // Determine amount paid from metadata or from session amount_total
          // metadata.amountCents is best for partial payments
          const amountCentsFromMeta = session?.metadata?.amountCents
            ? Number(session.metadata.amountCents)
            : null;

          const cents =
            Number.isFinite(amountCentsFromMeta) && amountCentsFromMeta > 0
              ? amountCentsFromMeta
              : session?.amount_total; // Stripe checkout session total in cents

          const amount = cents ? Math.round((cents / 100) * 100) / 100 : null;

          if (!amount || amount <= 0) {
            console.warn(
              "[stripeWebhook] Could not determine invoice payment amount.",
              {
                orderId,
                stripeSessionId,
              },
            );
            return res.status(200).json({ received: true });
          }

          order.payments = order.payments || [];
          order.payments.push({
            amount,
            method: "card",
            reference: stripeSessionId || null,
            notes: "Stripe invoice payment",
            paidAt: new Date(),
            source: "customer_portal",
            stripeSessionId: stripeSessionId || null,
            stripePaymentIntentId: paymentIntentId || null,
            stripeChargeId: chargeId || null,
            // receiptUrl: receiptUrl || null,
            createdBy: userId,
          });
        }

        // Recompute invoice totals/status safely
        const total = order.grandTotal ?? order.total ?? 0;
        const amountPaid = (order.payments || []).reduce(
          (sum, p) => sum + (Number(p.amount) || 0),
          0,
        );
        const rawBalance = total - amountPaid;
        const balanceDue = rawBalance < 0 ? 0 : rawBalance;

        order.amountPaid = Math.round(amountPaid * 100) / 100;
        order.balanceDue = Math.round(balanceDue * 100) / 100;

        // Invoice status
        if (order.balanceDue <= 0 && total > 0) order.invoiceStatus = "paid";
        else if (order.amountPaid > 0) order.invoiceStatus = "partially_paid";
        else order.invoiceStatus = "open";

        // Optional: keep order.status aligned
        // If your UI uses order.status heavily, you can:
        if (order.invoiceStatus === "paid") {
          order.status = "paid";
          order.paidAt = order.paidAt || new Date();
        } else {
          // keep it in a non-paid state
          // (choose the enum you already have; examples:, "processing")
          if (order.status === "paid") {
            // don't regress paid orders; but invoice orders shouldn't hit this
          } else {
            order.status = order.status || "pending_payment";
          }
        }

        order.events.push("invoice_payment:webhook");

        // Store PI/Charge on top-level payment subdoc if you keep it (optional)
        // For invoice orders, we prefer per-payment entry storage instead.
        await order.save();

        return res.status(200).json({ received: true });
      }

      // ============================================================
      // BRANCH 2: STANDARD CHECKOUT (original behavior)
      // ============================================================

      // If already paid, acknowledge (idempotency)
      if (order.status === "paid") {
        return res.status(200).json({ received: true });
      }

      // Stripe Returns Values in Cents
      const total_paid = session.amount_total / 100;

      if (order.status !== "paid") {
        order.payments = order.payments || [];
        order.payments.push({
          // amount: session.amount_total,
          amount: total_paid,
          method: "card",
          reference: stripeSessionId || null,
          notes: "Stripe order payment",
          paidAt: new Date(),
          source: "customer_portal",
          stripeSessionId: stripeSessionId || null,
          stripePaymentIntentId: paymentIntentId || null,
          stripeChargeId: chargeId || null,
          createdBy: userId,
        });
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
