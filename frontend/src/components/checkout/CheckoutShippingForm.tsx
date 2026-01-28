import { useCheckoutStore } from "../../store/checkout.store";

export default function CheckoutShippingForm() {
  const shipping = useCheckoutStore((s) => s.shipping);
  const setShipping = useCheckoutStore((s) => s.setShipping);

  return (
    <div className="card space-y-3">
      <h3 className="font-semibold">Shipping Address</h3>

      <div>
        <label className="text-sm">Attention / Name</label>
        <input
          className="input mt-1 w-full"
          value={shipping.name || ""}
          onChange={(e) => setShipping({ name: e.target.value })}
        />
      </div>

      <div>
        <label className="text-sm">Address Line 1</label>
        <input
          className="input mt-1 w-full"
          value={shipping.line1}
          onChange={(e) => setShipping({ line1: e.target.value })}
          placeholder="123 Main St"
        />
      </div>

      <div>
        <label className="text-sm">Address Line 2</label>
        <input
          className="input mt-1 w-full"
          value={shipping.line2 || ""}
          onChange={(e) => setShipping({ line2: e.target.value })}
          placeholder="Suite 200"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div>
          <label className="text-sm">City</label>
          <input
            className="input mt-1 w-full"
            value={shipping.city}
            onChange={(e) => setShipping({ city: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm">State</label>
          <input
            className="input mt-1 w-full"
            value={shipping.state}
            onChange={(e) => setShipping({ state: e.target.value })}
            placeholder="TX"
          />
        </div>
        <div>
          <label className="text-sm">ZIP</label>
          <input
            className="input mt-1 w-full"
            value={shipping.zip}
            onChange={(e) => setShipping({ zip: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="text-sm">Country</label>
        <input
          className="input mt-1 w-full"
          value={shipping.country}
          onChange={(e) => setShipping({ country: e.target.value })}
        />
      </div>
    </div>
  );
}
