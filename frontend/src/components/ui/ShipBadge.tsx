import type { ShippingRollup } from "../../lib/shipping";
import { labelShippingRollup } from "../../lib/shipping";

export default function ShipBadge({ status }: { status: ShippingRollup }) {
  // neutral badge (subtle, consistent with your style)
  return (
    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium text-gray-700">
      {labelShippingRollup(status)}
    </span>
  );
}
