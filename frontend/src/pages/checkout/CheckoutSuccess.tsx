import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCartStore } from "../../store/cart.store";
import { useCheckoutStore } from "../../store/checkout.store";

export default function CheckoutSuccess() {
  const clearCart = useCartStore((s) => s.clearCart);
  const resetCheckout = useCheckoutStore((s) => s.resetCheckout);

  const [params] = useSearchParams();
  const sessionId = params.get("session_id") || params.get("sessionId");

  useEffect(() => {
    // Stripe redirects here after payment success
    clearCart();
    resetCheckout();
  }, [clearCart, resetCheckout]);

  return (
    <div className="card space-y-3">
      <h2 className="text-xl font-semibold">Payment successful 🎉</h2>
      <p className="text-gray-700">
        Thanks — your order has been submitted.
      </p>

      {sessionId ? (
        <p className="text-xs text-gray-500 break-all">
          Stripe Session: <span className="font-mono">{sessionId}</span>
        </p>
      ) : null}

      <div className="flex gap-2">
        <Link to="/products" className="btn-primary">Continue shopping</Link>
        <Link to="/" className="btn-outline">Home</Link>
      </div>
    </div>
  );
}
