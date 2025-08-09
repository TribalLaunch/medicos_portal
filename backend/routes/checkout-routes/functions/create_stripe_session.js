// src/routes/checkout/functions/createStripeSession.js
import Stripe from "stripe";
import { config } from "../../../config/env.js";
import { priceCart } from "../../../services/pricing.js";
import Order from "../../../models/Order.js";

const stripe = new Stripe(config.stripeSecret);

export async function createStripeSessionFn({
  items,
  customerId,
  shippingAddress,
  clientUrl,
  flatRate,
}) {
  const priced = await priceCart({ items, customerId });
  const shipping = Number(flatRate || 0);

  const line_items = priced.items.map((i) => ({
    price_data: {
      currency: "usd",
      product_data: { name: `${i.sku} - ${i.name}` },
      unit_amount: Math.round(i.unitPrice * 100),
    },
    quantity: i.qty,
  }));

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items,
    success_url: `${clientUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${clientUrl}/cart`,
    metadata: { customerId: customerId || "" },
  });

  const order = await Order.create({
    customerId: customerId || null,
    items: priced.items,
    shippingAddress,
    subtotal: priced.subtotal,
    shipping,
    total: priced.subtotal + shipping,
    status: "new",
    stripeSessionId: session.id,
    events: ["created"],
  });

  return { url: session.url, orderId: order._id };
}
