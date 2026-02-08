import type { Order, OrderPayment } from "../services/orders.service";

export function sumPayments(payments?: OrderPayment[]) {
  return (payments || []).reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
}

export function getOrderTotal(o: Order) {
  const v = o.total ?? o.subtotal ?? 0;
  return Number(v) || 0;
}

export function getAmountPaid(o: Order) {
  const fromField = Number(o.amountPaid);
  if (Number.isFinite(fromField) && fromField >= 0) return fromField;
  return sumPayments(o.payments);
}

export function getBalanceDue(o: Order) {
  const fromField = Number(o.balanceDue);
  if (Number.isFinite(fromField) && fromField >= 0) return fromField;

  const total = getOrderTotal(o);
  const paid = getAmountPaid(o);
  return Math.max(0, Math.round((total - paid) * 100) / 100);
}

export function isInvoiceOrder(o: Order) {
  return o.paymentMethod === "invoice";
}

export function getDueDate(o: Order) {
  return o.dueDate ? new Date(o.dueDate) : null;
}
