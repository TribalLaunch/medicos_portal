import type { Fulfillment } from "../../services/orders.service";

function fmtDate(d?: string) {
  if (!d) return "-";
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? String(d) : dt.toLocaleString();
}

function statusLabel(s?: string) {
  return s ? String(s).replace(/_/g, " ") : "pending";
}

export default function FulfillmentList({
  fulfillments,
  readOnly = true,
}: {
  fulfillments?: Fulfillment[];
  readOnly?: boolean;
}) {
  const list = fulfillments || [];
  if (list.length === 0) {
    return <div className="text-sm text-gray-600">No shipments yet.</div>;
  }

  return (
    <div className="space-y-3">
      {list.map((f) => (
        <div key={f._id} className="border rounded-xl p-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-semibold">
                {f.carrier || "Carrier"} • {statusLabel(f.status)}
              </div>
              <div className="text-sm text-gray-600">
                Tracking:{" "}
                {f.trackingUrl ? (
                  <a className="text-sky-700 underline" href={f.trackingUrl} target="_blank" rel="noreferrer">
                    {f.trackingNumber || "View tracking"}
                  </a>
                ) : (
                  <span>{f.trackingNumber || "-"}</span>
                )}
              </div>
              <div className="text-xs text-gray-500">
                Shipped: {fmtDate(f.shippedAt)} • Delivered: {fmtDate(f.deliveredAt)}
              </div>
            </div>

            {f.labelUrl ? (
              <a className="btn-outline" href={f.labelUrl} target="_blank" rel="noreferrer">
                Label
              </a>
            ) : null}
          </div>

          {Array.isArray(f.items) && f.items.length > 0 ? (
            <div className="mt-3 text-sm">
              <div className="text-gray-600 mb-1">Items:</div>
              <ul className="list-disc pl-5">
                {f.items.map((it, idx) => (
                  <li key={`${it.sku}-${idx}`}>
                    {it.sku} × {it.qty}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {Array.isArray(f.events) && f.events.length > 0 ? (
            <details className="mt-3">
              <summary className="cursor-pointer text-sm text-gray-700">Tracking events</summary>
              <div className="mt-2 space-y-2">
                {f.events
                  .slice()
                  .sort((a, b) => (a.at || "").localeCompare(b.at || ""))
                  .map((e, i) => (
                    <div key={i} className="text-sm border rounded-lg p-2">
                      <div className="text-xs text-gray-500">{fmtDate(e.at)}</div>
                      <div className="font-medium">{e.code || "Event"}</div>
                      <div className="text-gray-700">{e.description}</div>
                      {e.location ? <div className="text-xs text-gray-500">{e.location}</div> : null}
                    </div>
                  ))}
              </div>
            </details>
          ) : null}
        </div>
      ))}
    </div>
  );
}
