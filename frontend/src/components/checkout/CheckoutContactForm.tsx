import { useEffect } from "react";
import { useCheckoutStore } from "../../store/checkout.store";
import { useAuthStore } from "../../app/store";

export default function CheckoutContactForm() {
  const { user } = useAuthStore();

  const email = useCheckoutStore((s) => s.email);
  const phone = useCheckoutStore((s) => s.phone);
  const setEmail = useCheckoutStore((s) => s.setEmail);
  const setPhone = useCheckoutStore((s) => s.setPhone);

  // If logged in, prefill email if store is empty
  useEffect(() => {
    if (user?.email && !email) setEmail(user.email);
  }, [user?.email, email, setEmail]);

  return (
    <div className="card space-y-3">
      <h3 className="font-semibold">Contact</h3>

      <div>
        <label className="text-sm">Email</label>
        <input
          className="input mt-1 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@clinic.com"
        />
      </div>

      <div>
        <label className="text-sm">Phone</label>
        <input
          className="input mt-1 w-full"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="(555) 555-5555"
        />
      </div>
    </div>
  );
}
