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

// Handling Partial Shipments. This is used in the orders listing for easy to look and see overall status
export type ShippingRollup =
  | "not_shipped"
  | "pending"
  | "labeled"
  | "in_transit"
  | "delivered"
  | "partial_delivered"
  | "exception";

export function getShippingRollup(fulfillments?: Fulfillment[]): ShippingRollup {
  const list = fulfillments || [];
  if (list.length === 0) return "not_shipped";

  const statuses = list.map((f) => f.status || "pending");

  if (statuses.includes("exception")) return "exception";

  const allDelivered = statuses.every((s) => s === "delivered");
  if (allDelivered) return "delivered";

  const anyDelivered = statuses.some((s) => s === "delivered");
  if (anyDelivered) return "partial_delivered";

  if (statuses.includes("in_transit")) return "in_transit";
  if (statuses.includes("labeled")) return "labeled";
  return "pending";
}

export function labelShippingRollup(s: ShippingRollup) {
  switch (s) {
    case "not_shipped":
      return "Not shipped";
    case "pending":
      return "Pending";
    case "labeled":
      return "Label created";
    case "in_transit":
      return "In transit";
    case "delivered":
      return "Delivered";
    case "partial_delivered":
      return "Partial delivered";
    case "exception":
      return "Exception";
    default:
      return s;
  }
}

export function shipmentCounts(fulfillments?: Fulfillment[]) {
  const list = fulfillments || [];
  const delivered = list.filter((f) => f.status === "delivered").length;
  return { delivered, total: list.length };
}
