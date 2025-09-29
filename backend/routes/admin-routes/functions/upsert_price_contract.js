import PriceContract from "../../../models/PriceContract.js";
import Product from "../../../models/Product.js";
import Customer from "../../../models/Customer.js";

export async function upsertPriceContractFn(req, res) {
  const { customerId, sku, contractPrice } = req.body || {};
  if (!customerId)
    return { status: 400, body: { error: "customerId is required" } };
  if (!sku) return { status: 400, body: { error: "sku is required" } };
  if (contractPrice == null || Number.isNaN(Number(contractPrice))) {
    return { status: 400, body: { error: "contractPrice must be a number" } };
  }

  const [customer, product] = await Promise.all([
    Customer.findById(customerId).lean(),
    Product.findOne({ sku }).lean(),
  ]);
  if (!customer) return { status: 404, body: { error: "Customer not found" } };
  if (!product)
    return { status: 404, body: { error: "Product not found for sku" } };

  const updated = await PriceContract.findOneAndUpdate(
    { customerId, sku },
    { $set: { customerId, sku, contractPrice: Number(contractPrice) } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).lean();

  res.json({
    status: 200,
    body: updated,
  });
}
