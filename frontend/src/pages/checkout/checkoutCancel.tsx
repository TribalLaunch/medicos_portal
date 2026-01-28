import { Link } from "react-router-dom";

export default function CheckoutCancel() {
  return (
    <div className="card space-y-3">
      <h2 className="text-xl font-semibold">Checkout canceled</h2>
      <p className="text-gray-700">
        No worries — your cart is still saved. You can try again anytime.
      </p>

      <div className="flex gap-2">
        <Link to="/checkout" className="btn-primary">Back to checkout</Link>
        <Link to="/products" className="btn-outline">Browse products</Link>
      </div>
    </div>
  );
}
