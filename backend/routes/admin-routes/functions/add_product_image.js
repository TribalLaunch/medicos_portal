// src/routes/admin/functions/addProductImage.js
import Product from "../../../models/Product.js";

export async function addProductImageFn({ sku, image, makePrimary = false }) {
  const update = { $push: { images: image } };
  if (makePrimary) update.$set = { primaryImageIndex: { $size: "$images" } }; // will be set in controller
  const product = await Product.findOne({ sku });
  if (!product) throw new Error("Product not found");

  product.images.push(image);
  if (makePrimary) product.primaryImageIndex = product.images.length - 1;

  await product.save();
  return product;
}
