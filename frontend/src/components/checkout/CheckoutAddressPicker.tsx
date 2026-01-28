import { useQuery } from "@tanstack/react-query";
import { getMyCustomer } from "../../services/customers.service";
import { useCheckoutStore } from "../../store/checkout.store";
import { useAuthStore } from "../../app/store";

export default function CheckoutAddressPicker() {
  const { user } = useAuthStore(); // only show if logged in

  const selectedAddressId = useCheckoutStore((s) => s.selectedAddressId);
  const setSelectedAddressId = useCheckoutStore((s) => s.setSelectedAddressId);
  const setShipping = useCheckoutStore((s) => s.setShipping);

  const { data, isLoading, error } = useQuery({
    queryKey: ["my-customer"],
    queryFn: getMyCustomer,
    enabled: !!user, // only call when logged in
  });

  if (!user) return null;
  if (isLoading) return <div className="card">Loading saved addresses…</div>;
  if (error) return <div className="card text-red-700">Could not load saved addresses.</div>;
  if (!data?.addresses?.length) return null;

  return (
    <div className="card space-y-2">
      <h3 className="font-semibold">Saved Addresses</h3>

      <select
        className="input w-full"
        value={selectedAddressId || ""}
        onChange={(e) => {
          const id = e.target.value || undefined;
          setSelectedAddressId(id);

          const addr = data.addresses.find((a) => a._id === id);
          if (!addr) return;

          setShipping({
            line1: addr.line1,
            line2: addr.line2 || "",
            city: addr.city,
            state: addr.state,
            zip: addr.zip,
            country: addr.country || "US",
          });
        }}
      >
        <option value="">Select an address</option>
        {data.addresses.map((a) => (
          <option key={a._id} value={a._id}>
            {(a.label ? `${a.label} — ` : "")}{a.line1}, {a.city} {a.state}
          </option>
        ))}
      </select>

      <p className="text-xs text-gray-500">
        Selecting an address fills the shipping form. You can edit it before paying.
      </p>
    </div>
  );
}
