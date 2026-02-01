import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Order, Fulfillment } from "../../services/orders.service";
import { createFulfillment, deleteFulfillment, updateFulfillment } from "../../services/fulfillment.service";

const carriers = ["UPS", "FedEx", "USPS", "DHL", "Other"] as const;
const statuses = ["pending", "labeled", "in_transit", "delivered", "exception"] as const;

function isoOrUndef(v: string) {
  const t = v.trim();
  return t ? new Date(t).toISOString() : undefined;
}

export default function FulfillmentAdminPanel({
  order,
  fulfillments,
  canEdit,
}: {
  order: Order;
  fulfillments?: Fulfillment[];
  canEdit: boolean;
}) {
  const qc = useQueryClient();
  const list = fulfillments || [];

  const [carrier, setCarrier] = useState<(typeof carriers)[number]>("UPS");
  const [status, setStatus] = useState<(typeof statuses)[number]>("pending");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [shippedAt, setShippedAt] = useState(""); // datetime-local string
  const [selected, setSelected] = useState<Record<string, number>>({}); // sku -> qty

  const itemsForDto = useMemo(() => {
    return Object.entries(selected)
      .filter(([, qty]) => qty > 0)
      .map(([sku, qty]) => ({ sku, qty }));
  }, [selected]);

  const refreshOrder = async () => {
    // refetch order detail query (whatever key you use)
    await qc.invalidateQueries({ queryKey: ["order", order._id] });
    await qc.invalidateQueries({ queryKey: ["orders"] });
    await qc.invalidateQueries({ queryKey: ["admin-orders"] });
  };

  const createMut = useMutation({
    mutationFn: () =>
      createFulfillment(order._id, {
        carrier,
        status,
        trackingNumber: trackingNumber.trim() || undefined,
        trackingUrl: trackingUrl.trim() || undefined,
        shippedAt: shippedAt ? new Date(shippedAt).toISOString() : undefined,
        items: itemsForDto,
      }),
    onSuccess: async () => {
      setTrackingNumber("");
      setTrackingUrl("");
      setShippedAt("");
      setSelected({});
      await refreshOrder();
    },
  });

  const deleteMut = useMutation({
    mutationFn: (fid: string) => deleteFulfillment(order._id, fid),
    onSuccess: refreshOrder,
  });

  const updateStatusMut = useMutation({
    mutationFn: ({ fid, status }: { fid: string; status: string }) =>
      updateFulfillment(order._id, fid, { status: status as any }),
    onSuccess: refreshOrder,
  });

  if (!canEdit) return null;

  return (
    <div className="space-y-4">
      <div className="border rounded-xl p-3 space-y-3">
        <div className="font-semibold">Add shipment</div>

        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <div className="text-sm text-gray-600">Carrier</div>
            <select className="input w-full" value={carrier} onChange={(e) => setCarrier(e.target.value as any)}>
              {carriers.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="text-sm text-gray-600">Status</div>
            <select className="input w-full" value={status} onChange={(e) => setStatus(e.target.value as any)}>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {String(s).replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="text-sm text-gray-600">Tracking #</div>
            <input className="input w-full" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} />
          </div>

          <div>
            <div className="text-sm text-gray-600">Tracking URL</div>
            <input className="input w-full" value={trackingUrl} onChange={(e) => setTrackingUrl(e.target.value)} />
          </div>

          <div>
            <div className="text-sm text-gray-600">Shipped at</div>
            <input
              className="input w-full"
              type="datetime-local"
              value={shippedAt}
              onChange={(e) => setShippedAt(e.target.value)}
            />
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-600 mb-2">Items in this shipment</div>
          <div className="space-y-2">
            {(order.items || []).map((it) => (
              <div key={it.sku} className="flex items-center justify-between border rounded-lg p-2">
                <div className="text-sm">
                  <div className="font-medium">{it.name}</div>
                  <div className="text-xs text-gray-500">SKU {it.sku}</div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    className="input w-20"
                    type="number"
                    min={0}
                    max={it.qty}
                    value={selected[it.sku] ?? 0}
                    onChange={(e) => {
                      const v = Math.max(0, Math.min(it.qty, Number(e.target.value)));
                      setSelected((p) => ({ ...p, [it.sku]: v }));
                    }}
                  />
                  <div className="text-xs text-gray-500">/ {it.qty}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          className="btn-primary w-full"
          disabled={createMut.isPending || itemsForDto.length === 0}
          onClick={() => createMut.mutate()}
          type="button"
        >
          {createMut.isPending ? "Creating…" : "Create fulfillment"}
        </button>

        {createMut.isError ? (
          <div className="text-sm text-red-700">
            {(createMut.error as any)?.message || "Failed to create fulfillment."}
          </div>
        ) : null}
      </div>

      <div className="space-y-2">
        <div className="font-semibold">Existing fulfillments</div>
        {list.length === 0 ? (
          <div className="text-sm text-gray-600">No fulfillments yet.</div>
        ) : (
          list.map((f) => (
            <div key={f._id} className="border rounded-xl p-3 flex items-start justify-between gap-3">
              <div>
                <div className="font-medium">
                  {f.carrier || "Carrier"} • {f.status || "pending"}
                </div>
                <div className="text-sm text-gray-600">
                  {f.trackingNumber ? `Tracking: ${f.trackingNumber}` : "No tracking number"}
                </div>
                {f.trackingUrl ? (
                  <a className="text-sm text-sky-700 underline" href={f.trackingUrl} target="_blank" rel="noreferrer">
                    Open tracking
                  </a>
                ) : null}
              </div>

              <div className="flex items-center gap-2">
                <select
                  className="input"
                  value={f.status || "pending"}
                  onChange={(e) => updateStatusMut.mutate({ fid: f._id, status: e.target.value })}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {String(s).replace(/_/g, " ")}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  className="btn-outline"
                  disabled={deleteMut.isPending}
                  onClick={() => deleteMut.mutate(f._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
