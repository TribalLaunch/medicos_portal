// src/routes/products/functions/listProducts.js
import Product from "../../../models/Product.js";
export function listProductsFn({ q, category }) {
  const filter = { active: true };
  if (category) filter.category = category;
  if (q) filter.$text = { $search: q };
  return Product.find(filter).limit(50).lean();
}
