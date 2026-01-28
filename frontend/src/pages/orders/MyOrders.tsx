import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { listMyOrders } from "../../services/orders.service";

export default function MyOrders() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => listMyOrders({ page: 1, pageSize: 20 }),
  });

  if (isLoading) return <div className="card">Loading orders…</div>;
  if (error) return <div className="card text-red-700">Failed to load orders.</div>;

  const orders = data?.data || [];

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
                <th>Status</th>
                <th className="text-right">Items</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-t">
                  {/* <td className="py-2">{new Date(o.createdAt).toLocaleString()}</td> */}
                  <td className="py-2">
  <Link className="text-sky-700 underline" to={`/orders/${o._id}`}>
    {new Date(o.createdAt).toLocaleString()}
  </Link>
</td>
                  <td>
                    <span className="badge">{o.status}</span>
                  </td>
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
