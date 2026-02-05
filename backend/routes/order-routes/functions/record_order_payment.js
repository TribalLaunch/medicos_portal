import Order from "../../../models/Order.js";
import { recomputeInvoiceTotals } from "../../../services/invoice.js";

// Payments made through the backoffice for an open invoice

export async function recordOrderPaymentFn({ params, body, user }) {
  const { orderId } = params || {};
  const { amount, method, reference, notes, paidAt } = body || {};

  if (!user?.id)
    return { status: 401, body: { message: "Not authenticated." } };

  const role = user.role || user.user_type;
  if (role !== "admin" && role !== "sales") {
    return { status: 403, body: { message: "Forbidden." } };
  }

  const order = await Order.findById(orderId);
  if (!order) return { status: 404, body: { message: "Order not found." } };

  if (order.paymentMethod !== "invoice") {
    return {
      status: 400,
      body: { message: "Payments can only be recorded for invoice orders." },
    };
  }

  const amt = Number(amount);
  if (!Number.isFinite(amt) || amt <= 0) {
    return {
      status: 400,
      body: { message: "amount must be a positive number." },
    };
  }

  // ensure we have current balanceDue
  recomputeInvoiceTotals(order);

  if (amt > order.balanceDue) {
    return {
      status: 400,
      body: { message: "Payment amount exceeds balanceDue." },
    };
  }

  order.payments = order.payments || [];
  order.payments.push({
    amount: amt,
    method,
    reference: reference || null,
    notes: notes || null,
    paidAt: paidAt ? new Date(paidAt) : new Date(),
    source: "backoffice",
    createdBy: user.id,
  });

  recomputeInvoiceTotals(order);
  await order.save();

  return { status: 200, body: { data: order } };
}
