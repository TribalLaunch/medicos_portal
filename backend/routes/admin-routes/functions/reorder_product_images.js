import mongoose from "mongoose";
import Product from "../../../models/Product.js";

/**
 * Reorder a product's images[] array based on orderedKeys.
 * Preserves the same primary image by key.
 *
 * Params: { productId }
 * Body: { orderedKeys: string[] }
 */
export async function reorderProductImagesFn({ params, body }) {
  const { productId } = params || {};
  const { orderedKeys } = body || {};

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return { status: 400, body: { error: "Invalid productId." } };
  }

  if (!Array.isArray(orderedKeys) || orderedKeys.length === 0) {
    return {
      status: 400,
      body: { error: "orderedKeys must be a non-empty array." },
    };
  }

  // Ensure all keys are strings and no duplicates in orderedKeys
  const cleaned = orderedKeys.map((k) =>
    typeof k === "string" ? k.trim() : "",
  );
  if (cleaned.some((k) => !k)) {
    return {
      status: 400,
      body: { error: "All orderedKeys must be non-empty strings." },
    };
  }

  const uniqueCount = new Set(cleaned).size;
  if (uniqueCount !== cleaned.length) {
    return {
      status: 400,
      body: { error: "orderedKeys contains duplicate keys." },
    };
  }

  const product = await Product.findById(productId);
  if (!product) return { status: 404, body: { error: "Product not found." } };

  product.images = Array.isArray(product.images) ? product.images : [];

  if (product.images.length === 0) {
    return {
      status: 400,
      body: { error: "Product has no images to reorder." },
    };
  }

  // Build a map of existing images by key
  const existingMap = new Map(product.images.map((img) => [img.key, img]));
  const existingKeys = new Set(existingMap.keys());

  // Validate: orderedKeys must match exactly the existing image keys
  const orderedSet = new Set(cleaned);

  // Missing keys
  const missing = [...existingKeys].filter((k) => !orderedSet.has(k));
  // Extra keys
  const extra = cleaned.filter((k) => !existingKeys.has(k));

  if (missing.length || extra.length) {
    return {
      status: 400,
      body: {
        error:
          "orderedKeys must include exactly the product's current image keys.",
        details: {
          missingKeys: missing,
          extraKeys: extra,
        },
      },
    };
  }

  // Preserve the current primary image by key
  const currentPrimaryIndex =
    typeof product.primaryImageIndex === "number"
      ? product.primaryImageIndex
      : 0;

  const currentPrimaryKey =
    product.images[currentPrimaryIndex]?.key || product.images[0]?.key;

  // Rebuild images in new order
  const reorderedImages = cleaned.map((k) => existingMap.get(k));

  product.images = reorderedImages;

  // Restore primaryImageIndex based on the preserved primary key
  const newPrimaryIndex = product.images.findIndex(
    (img) => img.key === currentPrimaryKey,
  );
  //   product.primaryImageIndex = newPrimaryIndex >= 0 ? newPrimaryIndex : 0;
  product.primaryImageIndex = 0;

  await product.save();

  return { status: 200, body: product.toObject() };
}
