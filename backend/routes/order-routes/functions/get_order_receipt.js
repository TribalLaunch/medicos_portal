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
  const { orderId, paymentId } = params || {};

  if (!user?.id) {
    return { status: 401, body: { error: "Not authenticated." } };
  }

  const order = await Order.findById(orderId).lean();
  if (!order) return { status: 404, body: { error: "Order not found." } };

  // const payment = (order.payments || []).id(paymentId); // mongoose subdoc finder
  const payment = (order.payments || []).find(
    (p) => String(p._id) === String(paymentId),
  );
  if (!payment) return { status: 404, body: { message: "Payment not found." } };

  // If we already stored it, return immediately
  if (payment.receiptUrl) {
    return { status: 200, body: { receiptUrl: payment.receiptUrl } };
  }

  // Attempt to fetch from Stripe if we have PI or charge
  // Prefer PaymentIntent -> latest_charge -> receipt_url
  let receiptUrl = null;

  if (payment.stripePaymentIntentId) {
    const pi = await stripe.paymentIntents.retrieve(
      payment.stripePaymentIntentId,
      {
        expand: ["latest_charge"],
      },
    );
    receiptUrl = pi?.latest_charge?.receipt_url || null;

    if (receiptUrl) {
      payment.receiptUrl = receiptUrl;
      // Also update chargeId if missing
      if (!payment.stripeChargeId && pi?.latest_charge?.id) {
        payment.stripeChargeId = pi.latest_charge.id;
      }
      // await order.save();
      return { status: 200, body: { receiptUrl } };
    }
  }

  // Fallback: retrieve charge directly if we have it
  if (payment.stripeChargeId) {
    const ch = await stripe.charges.retrieve(payment.stripeChargeId);
    receiptUrl = ch?.receipt_url || null;

    if (receiptUrl) {
      payment.receiptUrl = receiptUrl;
      await order.save();
      return { status: 200, body: { receiptUrl } };
    }
  }
}
