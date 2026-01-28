import { Link } from "react-router-dom";
import { useState } from "react";
import { createStripeSession } from "../../services/checkout.service";
import CartLineItem from "../../components/cart/CartLineItem";
import { useCartStore } from "../../store/cart.store";
import CheckoutContactForm from "../../components/checkout/CheckoutContactForm";
import CheckoutShippingForm from "../../components/checkout/CheckoutShippingForm";
import CheckoutAddressPicker from "../../components/checkout/CheckoutAddressPicker";
import { useCheckoutStore } from "../../store/checkout.store";

function validateCheckout(email: string, shipping: any) {
  if (!email) return "Email is required.";
  if (!shipping.line1 || !shipping.city || !shipping.state || !shipping.zip) {
    return "Shipping address is incomplete.";
  }
  return null;
}

export default function Checkout() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const clearCart = useCartStore((s) => s.clearCart);

  const email = useCheckoutStore((s) => s.email);
  const shipping = useCheckoutStore((s) => s.shipping);
  const resetCheckout = useCheckoutStore((s) => s.resetCheckout);

  const [isSubmitting, setIsSubmitting] = useState(false);
const phone = useCheckoutStore((s) => s.phone);


  const validationError = validateCheckout(email, shipping);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Checkout</h2>
        {items.length > 0 && (
          <button
            className="btn-outline"
            onClick={() => {
              clearCart();
              resetCheckout();
            }}
            type="button"
          >
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
          {/* Left: cart + forms */}
          <div className="lg:col-span-2 space-y-4">
            <div className="card">
              {items.map((it) => (
                <CartLineItem key={`${it.sku}::${it.size || ""}`} item={it} />
              ))}
            </div>

            <CheckoutAddressPicker />
            <CheckoutContactForm />
            <CheckoutShippingForm />
          </div>

          {/* Right: summary */}
          <div className="card h-fit space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>

            {validationError ? (
              <div className="text-sm text-red-700">{validationError}</div>
            ) : (
              <div className="text-sm text-green-700">Checkout details look good.</div>
            )}

            <button
  className="btn-primary w-full"
  disabled={!!validationError || isSubmitting}
  onClick={async () => {
    try {
    setIsSubmitting(true);

    const { url, orderId } = await createStripeSession({
      email,
      phone,
      shippingAddress: shipping,
      cartItems: items,
    });

    // Optional: store orderId so success page can show it or use it later
    sessionStorage.setItem("lastOrderId", orderId);

    window.location.href = url;
  } catch (e: any) {
    alert(e?.message || "Failed to start checkout. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
  }}

  type="button"
>
  {isSubmitting ? "Redirecting…" : "Continue to payment"}
</button>

            {/* <button className="btn-primary w-full" disabled>
              Continue to payment (Phase 3.3)
            </button> */}

            <p className="text-xs text-gray-500">
              Stripe payment will be enabled in Phase 3.3.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}





// import { Link } from "react-router-dom";
// import CartLineItem from "../../components/cart/CartLineItem";
// import { useCartStore } from "../../store/cart.store";

// export default function Checkout() {
//   const items = useCartStore((s) => s.items);
//   const subtotal = useCartStore((s) => s.subtotal());
//   const clearCart = useCartStore((s) => s.clearCart);

//   return (
//     <section className="space-y-4">
//       <div className="flex items-center justify-between">
//         <h2 className="text-xl font-semibold">Checkout</h2>
//         {items.length > 0 && (
//           <button className="btn-outline" onClick={clearCart}>
//             Clear cart
//           </button>
//         )}
//       </div>

//       {items.length === 0 ? (
//         <div className="card">
//           Your cart is empty.{" "}
//           <Link to="/products" className="text-sky-700 underline">
//             Browse products
//           </Link>
//         </div>
//       ) : (
//         <div className="grid gap-4 lg:grid-cols-3">
//           <div className="lg:col-span-2 card">
//             {items.map((it) => (
//               <CartLineItem key={`${it.sku}::${it.size || ""}`} item={it} />
//             ))}
//           </div>

//           <div className="card h-fit space-y-3">
//             <div className="flex items-center justify-between">
//               <span className="text-gray-600">Subtotal</span>
//               <span className="font-semibold">${subtotal.toFixed(2)}</span>
//             </div>

//             <button className="btn-primary w-full" disabled>
//               Continue to payment (Phase 3.3)
//             </button>

//             <p className="text-xs text-gray-500">
//               Payment via Stripe Checkout will be enabled in Phase 3.3.
//             </p>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// }
