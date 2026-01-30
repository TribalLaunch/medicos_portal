import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listAdminOrders } from "../../services/orders.service";
import { Link } from "react-router-dom";

export default function AdminOrders() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-orders", q, status],
    queryFn: () => listAdminOrders({ page: 1, pageSize: 25, q: q || undefined, status: status || undefined }),
  });

  if (isLoading) return <div className="card">Loading orders…</div>;
  if (error) return <div className="card text-red-700">Failed to load orders.</div>;

  const getCustomerName = (o: any) =>
    o.customerName ||
    o.customer?.customer_name ||
    o.customerId?.customer_name ||
    "-";

  const getCustomerNumber = (o: any) =>
    o.customerNumber ||
    o.customer?.customer_number ||
    o.customerId?.customer_number ||
    "-";

  const getCustomerEmail = (o: any) =>
    o.customerEmail ||
    o.customer?.primary_email ||
    o.customerId?.primary_email ||
    "-";

  const getOrderTotal = (o: any) => {
    const t = o.total ?? o.subtotal;
    if (typeof t === "number") return t;
    // fallback: sum line items
    const sum = (o.items || []).reduce((s: number, it: any) => s + (it.price || 0) * (it.qty || 0), 0);
    return sum;
  };

  const fmtMoney = (n: number) => `$${Number(n || 0).toFixed(2)}`;

  const orders = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Sales Orders</h2>
      </div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Orders</h2>
        <Link className="btn-primary" to="/sales/orders/new">New Order</Link>
      </div>

      <div className="card flex flex-col md:flex-row gap-2">
        <select
          className="input md:w-56"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="new">new</option>
          <option value="processing">processing</option>
          <option value="paid">paid</option>
          <option value="shipped">shipped</option>
          <option value="cancelled">cancelled</option>
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
                <th>Source</th>
                <th>Customer</th>
                <th>Customer #</th>
                <th>Email</th>
                <th className="text-right">Items</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const total = getOrderTotal(o);
                return (
                  <tr key={o._id} className="border-t">
                    <td className="py-2">
                      <a className="text-sky-700 underline" href={`/sales/orders/${o._id}`}>
                        {new Date(o.createdAt).toLocaleString()}
                      </a>
                    </td>
                    <td><span className="badge">{o.status}</span></td>
                    <td>
                      <span className="badge">
                        {o.source || "website"}
                      </span>
                    </td>
                    <td className="font-medium">{getCustomerName(o)}</td>
                    <td className="font-mono text-sm">{getCustomerNumber(o)}</td>
                    <td>{getCustomerEmail(o)}</td>
                    <td className="text-right">
                      {o.items?.reduce((s: number, x: any) => s + (x.qty || 0), 0) || 0}
                    </td>
                    <td className="text-right font-semibold">{fmtMoney(total)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
