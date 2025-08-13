// src/routes/admin/functions/removeProductImage.js
import { deleteObject } from "../../../services/s3.js";
import Product from "../../../models/Product.js";

export async function removeProductImageFn({ sku, key }) {
  const product = await Product.findOne({ sku });
  if (!product) throw new Error("Product not found");

  if (!key) throw new Error("key is required");

  const idx = product.images.findIndex((i) => i.key === key);
  if (idx === -1) throw new Error("Image not found on product");

  await deleteObject(key);

  product.images.splice(idx, 1);
  if (product.primaryImageIndex >= product.images.length) {
    product.primaryImageIndex = Math.max(0, product.images.length - 1);
  }
  await product.save();
  return product;
}
