import { useMemo, useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";

import { searchAdminCustomers } from "../../services/admin.customer.service";
import { searchProducts } from "../../services/products.lookup";
import { createAdminOrder } from "../../services/orders.service";

type Line = {
  sku: string;
  name?: string;
  qty: number;
  size?: string;
  price?: number;
};

export default function AdminCreateOrder() {
  const nav = useNavigate();

  const [customerQ, setCustomerQ] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");

  const [orderType, setOrderType] = useState<"manual" | "po">("po");
  const [poNumber, setPoNumber] = useState("");

  const [skuInput, setSkuInput] = useState("");
  const [lines, setLines] = useState<Line[]>([]);

  useEffect(() => {
  setSelectedCustomerId("");
}, [customerQ]);

  // Customers (admin)
  const { data: customers, isFetching: customersFetching } = useQuery({
  queryKey: ["admin-customers", customerQ],
  queryFn: async () =>
    await searchAdminCustomers({
      q: customerQ.trim() || undefined,
      page: 1,
      pageSize: 50,
    }),
  staleTime: 30_000,
});

  // Product search by SKU input (lightweight)
  const { data: productHits, isFetching: productsFetching } = useQuery({
    queryKey: ["product-sku-lookup", skuInput],
    queryFn: () => searchProducts({ q: skuInput, pageSize: 8 }),
    enabled: skuInput.trim().length >= 2,
  });

  const addLine = (line: Line) => {
    setLines((prev) => {
      // merge if same sku + size
      const idx = prev.findIndex((x) => x.sku === line.sku && (x.size || "") === (line.size || ""));
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + line.qty };
        return copy;
      }
      return [...prev, line];
    });
  };

  const removeLine = (i: number) => setLines((prev) => prev.filter((_, idx) => idx !== i));

  const canSubmit = useMemo(() => {
    if (!selectedCustomerId) return false;
    if (lines.length === 0) return false;
    if (orderType === "po" && !poNumber.trim()) return false;
    return true;
  }, [selectedCustomerId, lines.length, orderType, poNumber]);

  const mutation = useMutation({
    mutationFn: async () => {
        console.log("SUBMITTED: ", {
            customerId: selectedCustomerId,
        orderType,
        poNumber: orderType === "po" ? poNumber.trim() : undefined,
        items: lines.map((l) => ({
          sku: l.sku,
          customer_name: l.name,
          qty: l.qty,
          size: l.size,
          price: l.price,
        })),
        })
      return createAdminOrder({
        customerId: selectedCustomerId,
        orderType,
        poNumber: orderType === "po" ? poNumber.trim() : undefined,
        items: lines.map((l) => ({
          sku: l.sku,
          customer_name: l.name,
          qty: l.qty,
          size: l.size,
          price: l.price,
        })),
      });
    },
    onSuccess: (resp: any) => {
      // if your postItem unwraps, resp may be {_id,...}; if not, adjust
      const id = resp?._id || resp?.data?._id;
      if (id) nav(`/orders/${id}`);
      else nav("/admin/orders");
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Create Order</h2>
        <Link to="/admin/orders" className="btn-outline">Back to Orders</Link>
      </div>

      {/* Customer selection */}
      <div className="card space-y-2">
        <div className="font-semibold">Customer</div>
        <input
          className="input w-full"
          placeholder="Search customers…"
          value={customerQ}
          onChange={(e) => setCustomerQ(e.target.value)}
        />

        <select
  className="input w-full"
  value={selectedCustomerId}
  onChange={(e) => setSelectedCustomerId(e.target.value)}
>
  <option value="">
    {customersFetching ? "Loading customers…" : "Select customer"}
  </option>

        {(customers || []).map((c) => (
            <option key={c._id} value={c._id}>
                {c.customer_number ? `${c.customer_number}` : ""}
            {`: ${c.customer_name}`}
            </option>
        ))}
        </select>

        {!customersFetching && (customers || []).length === 0 ? (
        <div className="text-sm text-gray-500 mt-1">
            No customers match “{customerQ}”.
        </div>
        ) : null}
      </div>

      {/* Order type */}
      <div className="card space-y-3">
        <div className="font-semibold">Order Type</div>
        <div className="flex gap-2">
          <button
            type="button"
            className={orderType === "po" ? "btn-primary" : "btn-outline"}
            onClick={() => setOrderType("po")}
          >
            Purchase Order
          </button>
          <button
            type="button"
            className={orderType === "manual" ? "btn-primary" : "btn-outline"}
            onClick={() => setOrderType("manual")}
          >
            Manual
          </button>
        </div>

        {orderType === "po" ? (
          <div>
            <label className="text-sm">PO Number</label>
            <input
              className="input mt-1 w-full"
              value={poNumber}
              onChange={(e) => setPoNumber(e.target.value)}
              placeholder="PO-12345"
            />
          </div>
        ) : null}
      </div>

      {/* Line items */}
      <div className="card space-y-3">
        <div className="font-semibold">Line Items</div>

        <input
          className="input w-full"
          placeholder="Type SKU or product name…"
          value={skuInput}
          onChange={(e) => setSkuInput(e.target.value)}
        />

        {productsFetching ? (
          <div className="text-sm text-gray-500">Searching…</div>
        ) : null}

        {(productHits || []).length > 0 ? (
          <div className="border rounded-xl overflow-hidden">
            {(productHits || []).map((p) => (
              <button
                key={p._id}
                type="button"
                className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b last:border-b-0"
                onClick={() => {
                  addLine({ sku: p.sku, name: p.name, qty: 1 });
                  setSkuInput("");
                }}
              >
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-gray-500">SKU {p.sku}</div>
              </button>
            ))}
          </div>
        ) : null}

        {lines.length === 0 ? (
          <div className="text-sm text-gray-600">No items yet.</div>
        ) : (
          <div className="space-y-2">
            {lines.map((l, idx) => (
              <div key={`${l.sku}-${idx}`} className="flex items-center justify-between border rounded-xl p-3">
                <div>
                  <div className="font-medium">{l.name || l.sku}</div>
                  <div className="text-xs text-gray-500">SKU {l.sku}</div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    className="input w-20"
                    type="number"
                    min={1}
                    value={l.qty}
                    onChange={(e) => {
                      const v = Math.max(1, Number(e.target.value));
                      setLines((prev) => prev.map((x, i) => (i === idx ? { ...x, qty: v } : x)));
                    }}
                  />
                  <button type="button" className="btn-outline" onClick={() => removeLine(idx)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="card">
        <button
          className="btn-primary w-full"
          disabled={!canSubmit || mutation.isPending}
          type="button"
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending ? "Creating…" : "Create Order"}
        </button>

        {mutation.isError ? (
          <div className="text-sm text-red-700 mt-2">
            {(mutation.error as any)?.message || "Failed to create order."}
          </div>
        ) : null}
      </div>
    </div>
  );
}
