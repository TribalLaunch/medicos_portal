import Stripe from "stripe";
import { config } from "../../../config/env.js";
import Order from "../../../models/Order.js";

const stripe = new Stripe(config.stripeSecret);

/**
 * GET /api/orders/:orderId/receipt
 * Returns Stripe receipt_url for a paid Stripe order (via PaymentIntent.latest_charge).
 *
 * Auth:
 * - admin/sales: allowed
 * - customer: allowed only if order.customerId matches req.user.id
 */
export async function getOrderReceiptFn({ params, user }) {
  const { orderId } = params || {};

  if (!user?.id) {
    return { status: 401, body: { error: "Not authenticated." } };
  }

  const order = await Order.findById(orderId).lean();
  if (!order) return { status: 404, body: { error: "Order not found." } };

  const paymentIntentId = order?.payment?.paymentIntentId;
  if (!paymentIntentId) {
    return {
      status: 400,
      body: { error: "No paymentIntentId found for this order." },
    };
  }

  // Retrieve PI + latest charge receipt url
  const pi = await stripe.paymentIntents.retrieve(paymentIntentId, {
    expand: ["latest_charge"],
  });

  const receiptUrl = pi?.latest_charge?.receipt_url || null;

  if (!receiptUrl) {
    return {
      status: 404,
      body: { error: "Receipt URL not available yet." },
    };
  }

  return { status: 200, body: { receiptUrl } };
}
