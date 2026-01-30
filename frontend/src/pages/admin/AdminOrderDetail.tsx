import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { getOrderById } from "../../services/orders.service";

function fmtMoney(n?: number) {
  const v = Number(n ?? 0);
  return `$${v.toFixed(2)}`;
}

export default function OrderDetail() {
  const { id } = useParams();

  const { data: order, isLoading, error } = useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrderById(id!),
    enabled: !!id,
  });

  if (!id) return <div className="card">Missing order id.</div>;
  if (isLoading) return <div className="card">Loading order…</div>;
  if (error) return <div className="card text-red-700">Failed to load order.</div>;
  if (!order) return <div className="card">Order not found.</div>;

  const itemCount = order.items?.reduce((s, x) => s + (x.qty || 0), 0) || 0;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm text-gray-500">Order</div>
          <h2 className="text-xl font-semibold">
            {order.orderNumber || order._id}
          </h2>
          <div className="text-sm text-gray-600">
            Placed {new Date(order.createdAt).toLocaleString()} · {itemCount} item(s)
          </div>
        </div>

        <div className="text-right">
          <div className="badge">{order.status}</div>
          {order.email ? <div className="text-xs text-gray-500 mt-1">{order.email}</div> : null}
        </div>
      </div>

      {/* Items */}
      <div className="card">
        <div className="font-semibold mb-3">Items</div>
        <div className="space-y-3">
          {(order.items || []).map((it, idx) => (
            <div key={`${it.sku}-${it.size || ""}-${idx}`} className="flex justify-between border-b pb-3 last:border-b-0 last:pb-0">
              <div>
                <div className="font-medium">{it.name}</div>
                <div className="text-xs text-gray-500">
                  SKU {it.sku} {it.size ? `· Size ${it.size}` : ""}
                </div>
                <div className="text-xs text-gray-500">Qty {it.qty}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{fmtMoney((it.unitPrice || 0) * (it.qty || 0))}</div>
                <div className="text-xs text-gray-500">{fmtMoney(it.unitPrice)} ea</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals (if present) */}
      {order ? (
        <div className="card space-y-2">
          <div className="font-semibold">Summary</div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span>{fmtMoney(order.subtotal)}</span>
          </div>

          {"shipping" in order ? (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span>{fmtMoney(order.shipping)}</span>
            </div>
          ) : null}

          {"tax" in order ? (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span>{fmtMoney(order.tax)}</span>
            </div>
          ) : null}

          <div className="flex justify-between text-base font-semibold pt-2 border-t">
            <span>Total</span>
            <span>{fmtMoney(order.total ?? order.subtotal)}</span>
          </div>
        </div>
      ) : null}

      <div className="flex gap-2">
        <Link to="/sales/orders" className="btn-outline">Back to Orders</Link>
      </div>
    </div>
  );
}
