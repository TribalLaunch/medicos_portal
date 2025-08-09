// src/routes/checkout/checkout.controller.js
import { createStripeSessionFn } from "./functions/create_stripe_session.js";
import { config } from "../../config/env.js";

export async function createStripeSession(req, res, next) {
  try {
    const { items, customerId, shippingAddress } = req.body;
    res.json(
      await createStripeSessionFn({
        items,
        customerId,
        shippingAddress,
        clientUrl: config.clientUrl,
        flatRate: config.flatRateShipping,
      })
    );
  } catch (e) {
    next(e);
  }
}
