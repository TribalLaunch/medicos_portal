import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { getOrderById } from "../../services/orders.service";
import { useAuthStore } from "../../app/store";
import { getPaymentId, type OrderPayment } from "../../services/orders.service";
import { useMutation } from "@tanstack/react-query";
import { getPaymentReceiptUrl } from "../../services/orders.service";
import { getAmountPaid, getBalanceDue, getDueDate, isInvoiceOrder } from "../../lib/orderFinance";

// Fulfillment Components
import FulfillmentList from "../../components/orders/FulfillmentList";
import FulfillmentAdminPanel from "../../components/admin/FulfillmentAdminPanel";
import PaymentsTable from "../../components/orders/PaymentsTable";

function fmtMoney(n?: number) {
  const v = Number(n ?? 0);
  return `$${v.toFixed(2)}`;
}

export default function OrderDetail() {
  const { id } = useParams();
  const orderId = id || "";

  const user = useAuthStore((s) => s.user);
const canEditFulfillment = user?.role === "admin" || user?.role === "sales";

  const { data: order, isLoading, error } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(id!),
    enabled: !!id,
  });

    const receiptMutation = useMutation({
    mutationFn: ({ orderId, paymentId }: { orderId: string; paymentId: string }) =>
      getPaymentReceiptUrl(orderId, paymentId),
  });

  if (!id) return <div className="card">Missing order id.</div>;
  if (isLoading) return <div className="card">Loading order…</div>;
  if (error) return <div className="card text-red-700">Failed to load order.</div>;
  if (!order) return <div className="card">Order not found.</div>;

  const itemCount = order.items?.reduce((s, x) => s + (x.qty || 0), 0) || 0;

  const handleViewReceipt = async (p: OrderPayment) => {
    const paymentId = getPaymentId(p);
  if (!paymentId) {
    alert("This payment does not have an ID yet (cannot open receipt).");
    return;
  }

  const win = window.open("about:blank", "_blank");
  if (win) win.opener = null;

  try {
    const resp = await receiptMutation.mutateAsync({ orderId, paymentId });
    const url = resp?.receiptUrl;
    if (!url) throw new Error("Receipt URL missing");
    if (!win) throw new Error("Popup blocked — please allow popups to view receipt.");
    win.location.assign(url.startsWith("http") ? url : `https://${url}`);
    win.focus();
  } catch (e: any) {
    if (win) win.close();
    alert(e?.message || "Could not open receipt.");
  }
  };

  const paymentsTotal =
  (order.payments || []).reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

const amountPaid = Number.isFinite(order.amountPaid as any)
  ? Number(order.amountPaid)
  : paymentsTotal;

const total = Number(order.total ?? order.subtotal ?? 0);

const balanceDue = Number.isFinite(order.balanceDue as any)
  ? Number(order.balanceDue)
  : Math.max(0, total - amountPaid);

   const dueDate = getDueDate(order)

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

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Paid</span>
            <span>{fmtMoney(amountPaid)}</span>
          </div>

          <div className="flex justify-between text-base font-semibold pt-2 border-t">
            <span className="text-gray-600">Balance due</span>
            <span className={balanceDue > 0 ? "font-semibold" : ""}>{fmtMoney(balanceDue)}</span>
          </div>

          {order.paymentMethod == "invoice" && dueDate ? (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Due date</span>
              <span>{dueDate.toLocaleDateString()}</span>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="flex gap-2">
        <Link to="/sales/orders" className="btn-outline">Back to Orders</Link>
      </div>

      {/* Payment History Section */}
            <div className="card space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Payments</div>
                {receiptMutation.isPending ? <div className="text-xs text-gray-500">Opening…</div> : null}
              </div>
      
              <PaymentsTable payments={order.payments} onViewReceipt={handleViewReceipt} />
            </div>

      {/* Fulfillment Section */}
      <div className="card space-y-3">
        <div className="flex items-center justify-between">
          <div className="font-semibold">Fulfillment</div>
        </div>

        {/* Show shipments to admin too */}
        <FulfillmentList fulfillments={order.fulfillments} readOnly={!canEditFulfillment} />

        {/* Admin/Sales can edit */}
        {canEditFulfillment ? (
          <div className="pt-3 border-t">
            <FulfillmentAdminPanel
              order={order}
              fulfillments={order.fulfillments}
              canEdit={canEditFulfillment}
            />
          </div>
        ) : null}
      </div>

    </div>
  );
}
