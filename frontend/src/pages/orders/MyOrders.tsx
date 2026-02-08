import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { listMyOrders } from "../../services/orders.service";
import { getBalanceDue, getDueDate, isInvoiceOrder } from "../../lib/orderFinance";
import { getShippingRollup, shipmentCounts } from "../../lib/shipping";

// Components
import DueBadge from "../../components/ui/DueBadge";
import ShipBadge from "../../components/ui/ShipBadge";

function fmtMoney(n?: number) {
  const v = Number(n ?? 0);
  return `$${v.toFixed(2)}`;
}

export default function MyOrders() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => listMyOrders({ page: 1, pageSize: 20 }),
  });

  if (isLoading) return <div className="card">Loading orders…</div>;
  if (error) return <div className="card text-red-700">Failed to load orders.</div>;

  // const orders = data || [];
  const orders = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">My Orders</h2>
        <Link className="btn-outline" to="/products">Shop</Link>
      </div>

      {orders.length === 0 ? (
        <div className="card">No orders yet.</div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-600">
              <tr>
                <th className="py-2">Date</th>
                <th>Shipping</th>
                <th>Balance</th>
                <th>Due Date</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => { 
                const balance = getBalanceDue(o);
                const invoice = isInvoiceOrder(o);
                const dueDate = getDueDate(o);
                const ship = getShippingRollup(o.fulfillments);
                const shipCounts = shipmentCounts(o.fulfillments);
                return (
                <tr key={o._id} className="border-t">
                  <td className="py-2">
                    <Link className="text-sky-700 underline" to={`/orders/${o._id}`}>
                      {new Date(o.createdAt).toLocaleString()}
                    </Link>
                  </td>

                  {/* <td>
                    <span className="badge">{o.status}</span>
                  </td> */}
                  <td className="whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <div>
                        <ShipBadge status={ship} />
                      </div>

                      {ship === "partial_delivered" ? (
                        <div className="text-xs text-gray-500">
                          {shipCounts.delivered}/{shipCounts.total} shipments delivered
                        </div>
                      ) : null}
                    </div>
                  </td>

                  <td className="whitespace-nowrap">
                    <span className={balance > 0 ? "font-semibold" : "text-gray-500"}>
                      {fmtMoney(balance)}
                    </span>
                    {balance > 0 ? <DueBadge /> : null}
                  </td>


                  <td className="whitespace-nowrap">
                    {invoice && balance > 0 && dueDate ? (
                      <span className="text-sm">{dueDate.toLocaleDateString()}</span>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>

                  <td className="text-right whitespace-nowrap">{fmtMoney(o.total)}</td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
