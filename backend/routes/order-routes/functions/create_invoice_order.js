import Order from "../../../models/Order.js";
import Customer from "../../../models/Customer.js";
import { priceCart } from "../../../services/pricing.js";
import { recomputeInvoiceTotals } from "../../../services/invoice.js";

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + Number(days || 0));
  return d;
}

// Customer Generated Create Invoice Function
// TO DO: Create ADMIN ONLY create Invoice

export async function createInvoiceOrderFn({ user, body }) {
  if (!user?.id)
    return { status: 401, body: { message: "Not authenticated." } };

  const customer = await Customer.findById(user.customerId).lean();
  if (!customer)
    return { status: 404, body: { message: "Customer not found." } };

  if (!customer.allowInvoice) {
    return {
      status: 403,
      body: { message: "Customer is not eligible for invoice terms." },
    };
  }

  const { items, shippingAddress } = body || {};
  if (!Array.isArray(items) || items.length === 0) {
    return { status: 400, body: { message: "At least one item is required." } };
  }

  // priceCart uses contract price if customerId provided, else MSRP
  const priced = await priceCart({ items, customerId: String(customer._id) });

  const termsDays = Number(customer.termsDays ?? 30);
  const createdAt = new Date();
  const dueDate = addDays(createdAt, termsDays);

  const order = await Order.create({
    customerId: customer._id,
    items: priced.items.map((i) => ({
      sku: i.sku,
      name: i.name,
      qty: i.qty,
      unitPrice: i.unitPrice,
    })),
    subtotal: priced.subtotal,
    shipping: 0,
    tax: 0,
    total: priced.subtotal,
    paymentMethod: "invoice",
    source: "website",
    termsDays,
    dueDate,
    invoiceStatus: "open",
    amountPaid: 0,
    balanceDue: priced.subtotal,
    shippingAddress: shippingAddress || null,
    payments: [],
  });

  // ensure computed fields are correct
  recomputeInvoiceTotals(order);
  await order.save();

  return { status: 201, body: { data: order } };
}
