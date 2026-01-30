/**
 * Admin/Sales-only manual order creation (PO/net terms/offline).
 * NOTE: Customer Stripe orders must use the Stripe Checkout flow.
 * This function intentionally rejects paymentMethod === 'stripe'.
 *
 * Replace the TODO sections with your exact field names/enums/utils
 * once you paste the models and shared helpers.
 */
/**
 * Admin/Sales-only manual order creation (PO / net terms / offline).
 * Stripe orders must use the Checkout flow (rejected here).
 */
import Order from "../../../models/Order.js";
import Product from "../../../models/Product.js";
import Customer from "../../../models/Customer.js";
import { priceCart } from "../../../services/pricing.js";

export async function createOrderFn(req, res, next) {
  try {
    const { role, id: userId } = req.user || {};
    if (!role || !["admin", "sales"].includes(role)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const {
      customerId,
      items, // [{ sku, qty }]
      shippingAddress,
      billingAddress,
      paymentMethod, // must NOT be 'stripe'
      paid, // boolean; if true, create as paid/offline
      // optional, only if your Order model already supports these:
      shipping = 0,
      discount = 0,
      tax = 0,
      ...rest
    } = req.body || {};

    if (!customerId) {
      return res.status(400).json({ error: "customerId is required" });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "At least one item is required" });
    }
    if (paymentMethod && String(paymentMethod).toLowerCase() === "stripe") {
      return res
        .status(400)
        .json({ error: "Stripe orders must use Stripe Checkout" });
    }

    const customer = await Customer.findById(customerId).lean();
    if (!customer) return res.status(404).json({ error: "Customer not found" });

    // --- PRICING (shared util) ---
    const cartForPricing = items.map((i) => {
      if (!i?.sku || !i?.qty || i.qty <= 0) {
        throw new Error("Each item requires a valid sku and qty > 0");
      }
      return { sku: i.sku, qty: i.qty };
    });

    const { items: pricedItems, subtotal } = await priceCart({
      items: cartForPricing,
      customerId,
    });

    // Optional enrichment with product fields (only if your Order item schema supports them)
    const skus = pricedItems.map((i) => i.sku);
    const productDocs = await Product.find({
      sku: { $in: skus },
      active: true,
    }).lean();
    const productBySku = Object.fromEntries(productDocs.map((p) => [p.sku, p]));

    const resolvedItems = pricedItems.map((li) => {
      const p = productBySku[li.sku];
      return {
        sku: li.sku,
        name: li.name,
        qty: li.qty,
        unitPrice: li.unitPrice,
        ...(p?.uom ? { uom: p.uom } : {}),
        ...(Array.isArray(p?.sizing) ? { sizing: p.sizing } : {}),
      };
    });

    // Totals — keep your codebase’s logic/fields
    const shippingNum = Number(shipping) || 0;
    const discountNum = Number(discount) || 0;
    const taxNum = Number(tax) || 0; // your MVP: non-taxable (0)
    const total = subtotal + shippingNum + taxNum - discountNum;

    // Status — use your model’s enum names
    const status = paid ? "paid" : "new";

    const orderDoc = {
      customerId,
      items: resolvedItems,
      shippingAddress: shippingAddress || null,
      billingAddress: billingAddress || null,
      paymentMethod,
      subtotal,
      shipping: shippingNum,
      tax: taxNum,
      discount: discountNum,
      total,
      status,
      events: [paid ? "paid:manual" : "new:manual"],
      // payment: {
      //   method: paymentMethod || "offline",
      // },
      ...(paid ? { paidAt: new Date() } : {}),
      // Include createdBy/source ONLY if your Order model already has those fields:
      user: userId,
      source: "backoffice",
    };

    const order = await Order.create(orderDoc);
    // Ensure plain JSON:
    const plain = order.toObject({ getters: true, virtuals: true });
    return res.status(201).json(plain);
  } catch (err) {
    console.error("[orders] createOrder error:", err?.message || err);
    return res.status(500).json({ error: "Failed to create order" });
  }
}
