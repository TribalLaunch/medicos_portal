import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listAdminOrders } from "../../services/orders.service";

export default function AdminOrders() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-orders", q, status],
    queryFn: () => listAdminOrders({ page: 1, pageSize: 25, q: q || undefined, status: status || undefined }),
  });

  if (isLoading) return <div className="card">Loading orders…</div>;
  if (error) return <div className="card text-red-700">Failed to load orders.</div>;

  const orders = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Orders</h2>
      </div>

      <div className="card flex flex-col md:flex-row gap-2">
        <input
          className="input flex-1"
          placeholder="Search (email, order #, sku)…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className="input md:w-56" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="pending">pending</option>
          <option value="paid">paid</option>
          <option value="fulfilled">fulfilled</option>
          <option value="canceled">canceled</option>
        </select>
        <button className="btn-outline" onClick={() => refetch()} type="button">
          Apply
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="card">No orders found.</div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-600">
              <tr>
                <th className="py-2">Date</th>
                <th>Status</th>
                <th>Email</th>
                <th className="text-right">Items</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-t">
                  {/* <td className="py-2">{new Date(o.createdAt).toLocaleString()}</td> */}
                  <td className="py-2">
  <a className="text-sky-700 underline" href={`/orders/${o._id}`}>
    {new Date(o.createdAt).toLocaleString()}
  </a>
</td>
                  <td><span className="badge">{o.status}</span></td>
                  <td>{o.email || "-"}</td>
                  <td className="text-right">{o.items?.reduce((s, x) => s + x.qty, 0) || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
