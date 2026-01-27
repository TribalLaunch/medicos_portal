import { Link } from "react-router-dom";
import CartLineItem from "../../components/cart/CartLineItem";
import { useCartStore } from "../../store/cart.store";

export default function Checkout() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const clearCart = useCartStore((s) => s.clearCart);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Checkout</h2>
        {items.length > 0 && (
          <button className="btn-outline" onClick={clearCart}>
            Clear cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="card">
          Your cart is empty.{" "}
          <Link to="/products" className="text-sky-700 underline">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 card">
            {items.map((it) => (
              <CartLineItem key={`${it.sku}::${it.size || ""}`} item={it} />
            ))}
          </div>

          <div className="card h-fit space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>

            <button className="btn-primary w-full" disabled>
              Continue to payment (Phase 3.3)
            </button>

            <p className="text-xs text-gray-500">
              Payment via Stripe Checkout will be enabled in Phase 3.3.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
