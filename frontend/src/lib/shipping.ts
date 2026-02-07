import type { Fulfillment } from "../services/orders.service";

const rank: Record<string, number> = {
  pending: 1,
  labeled: 2,
  in_transit: 3,
  delivered: 4,
  exception: 5, // treat as “special”
};

export function getShippingStatus(fulfillments?: Fulfillment[]) {
  const list = fulfillments || [];
  if (list.length === 0) return "not_shipped";

  // If any exception, surface it
  if (list.some((f) => f.status === "exception")) return "exception";

  let best = "pending";
  let bestRank = 0;
  for (const f of list) {
    const s = f.status || "pending";
    const r = rank[s] || 0;
    if (r > bestRank) {
      bestRank = r;
      best = s;
    }
  }
  return best;
}

export function labelShippingStatus(s: string) {
  switch (s) {
    case "not_shipped": return "Not shipped";
    case "pending": return "Pending";
    case "labeled": return "Labeled";
    case "in_transit": return "In transit";
    case "delivered": return "Delivered";
    case "exception": return "Exception";
    default: return s;
  }
}
