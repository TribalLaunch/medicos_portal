// src/routes/products/functions/getProduct.js
import Product from "../../../models/Product.js";
export function getProductFn(sku) {
  return Product.findOne({ sku, active: true }).lean();
}
