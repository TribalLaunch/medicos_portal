// src/routes/admin/functions/upsertProduct.js
import Product from "../../../models/Product.js";
export function upsertProductFn(doc) {
  return Product.findOneAndUpdate(
    { sku: doc.sku },
    { $set: doc },
    { upsert: true, new: true }
  );
}
