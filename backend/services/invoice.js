export function recomputeInvoiceTotals(order) {
  const total = order.grandTotal ?? order.total ?? 0;

  const payments = Array.isArray(order.payments) ? order.payments : [];
  const amountPaid = payments.reduce(
    (sum, p) => sum + (Number(p.amount) || 0),
    0,
  );

  const rawBalance = total - amountPaid;
  const balanceDue = rawBalance < 0 ? 0 : rawBalance;

  let invoiceStatus = order.invoiceStatus;

  if (order.paymentMethod === "invoice") {
    if (balanceDue <= 0 && total > 0) invoiceStatus = "paid";
    else if (amountPaid > 0) invoiceStatus = "partially_paid";
    else invoiceStatus = "open";
  }

  order.amountPaid = Math.round(amountPaid * 100) / 100;
  order.balanceDue = Math.round(balanceDue * 100) / 100;
  order.invoiceStatus = invoiceStatus;
}
