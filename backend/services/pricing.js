import PriceContract from "../models/PriceContract.js";
import Product from "../models/Product.js";

export async function priceCart({ items, customerId }) {
  // items: [{ sku, qty }]
  const skus = items.map((i) => i.sku);
  const products = await Product.find({
    sku: { $in: skus },
    active: true,
  }).lean();
  const prodMap = Object.fromEntries(products.map((p) => [p.sku, p]));
  let contractMap = {};
  if (customerId) {
    const contracts = await PriceContract.find({
      customerId,
      sku: { $in: skus },
    }).lean();
    contractMap = Object.fromEntries(
      contracts.map((c) => [c.sku, c.contractPrice])
    );
  }
  const priced = items.map((i) => {
    const p = prodMap[i.sku];
    if (!p) throw new Error(`SKU not found: ${i.sku}`);
    const unitPrice = contractMap[i.sku] ?? p.priceMSRP;
    return { sku: i.sku, name: p.name, qty: i.qty, unitPrice };
  });
  const subtotal = priced.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  return { items: priced, subtotal };
}
