import { postItem } from "../lib/fetcher";
import type { CartItem } from "../store/cart.store";
import type { ShippingAddress } from "../store/checkout.store";

export type CreateStripeSessionPayload = {
  email: string;
  phone?: string;
  shippingAddress: ShippingAddress;
  items: Array<{
    sku: string;
    name: string;
    qty: number;
    price: number; // per-unit
    size?: string;
    requiresPrescription?: boolean;
  }>;
};

export type CreateStripeSessionResponse = {
  url: string; // Stripe checkout session URL
  orderId: string;
};

export async function createStripeSession(args: {
  email: string;
  phone?: string;
  shippingAddress: ShippingAddress;
  cartItems: CartItem[];
}) {
  const payload: CreateStripeSessionPayload = {
    email: args.email,
    phone: args.phone,
    shippingAddress: args.shippingAddress,
    items: args.cartItems.map((x) => ({
      sku: x.sku,
      name: x.name,
      qty: x.qty,
      price: x.price,
      size: x.size,
      requiresPrescription: x.requiresPrescription,
    })),
  };

  return postItem<CreateStripeSessionResponse>("/checkout/stripe-session", payload);
}
