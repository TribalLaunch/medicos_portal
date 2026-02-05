// src/routes/webhooks/stripe.controller.js
import Stripe from "stripe";
import { config } from "../../../config/env.js";
import Order from "../../../models/Order.js";
import { recomputeInvoiceTotals } from "../../../services/invoice.js";

const stripe = new Stripe(config.stripeSecret);

export async function createInvoiceStripePaymentSessionFn({
  params,
  body,
  user,
}) {
  const { orderId } = params || {};
  const reqAmount = body?.amount;

  if (!user?.id)
    return { status: 401, body: { message: "Not authenticated." } };

  const order = await Order.findById(orderId).populate("customerId");
  if (!order) return { status: 404, body: { message: "Order not found." } };

  //   const role = user.role || user.user_type;
  //   const isStaff = role === "admin" || role === "sales";

  console.log("ORDER CUSTOMER: ", order.customerId._id);

  const isOwner =
    order.customerId &&
    String(order.customerId._id) === String(user.customerId);

  // User does not own this order
  if (!isOwner) return { status: 403, body: { message: "Forbidden." } };

  if (order.paymentMethod !== "invoice") {
    return {
      status: 400,
      body: { message: "Stripe pay-later is only for invoice orders." },
    };
  }

  if (order.invoiceStatus === "paid" || order.invoiceStatus === "void") {
    return { status: 400, body: { message: "This invoice is not payable." } };
  }

  recomputeInvoiceTotals(order);

  const amountToPay = reqAmount == null ? order.balanceDue : Number(reqAmount);

  if (!Number.isFinite(amountToPay) || amountToPay <= 0) {
    return {
      status: 400,
      body: { message: "amount must be a positive number." },
    };
  }
  if (amountToPay > order.balanceDue) {
    return { status: 400, body: { message: "amount exceeds balanceDue." } };
  }

  const amountCents = Math.round(amountToPay * 100);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: `Invoice Payment - Order ${order._id}` },
          unit_amount: amountCents,
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.CLIENT_URL}/orders/${order._id}?paid=1`,
    cancel_url: `${process.env.CLIENT_URL}/orders/${order._id}?canceled=1`,
    metadata: {
      orderId: String(order._id),
      purpose: "invoice_payment",
      amountCents: String(amountCents),
      user: user._id,
    },
  });

  // We do NOT mark paid here; webhook will append payment entry.
  // But we can store session id if you want for debugging:
  // order.invoiceStripeSessionIds = [...]; (ONLY if field exists)
  await order.save();

  return {
    status: 200,
    body: { data: { url: session.url, sessionId: session.id } },
  };
}
