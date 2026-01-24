// src/routes/admin/functions/addProductImage.js
import Product from "../../../models/Product.js";
import mongoose from "mongoose";

/**
 * Add an image metadata record to an existing product.
 * Expects the file already uploaded to S3 using a presigned PUT URL.
 *
 * Route: POST /api/admin/products/:productId/images
 * Body: { key: string, url: string, alt?: string, makePrimary?: boolean }
 */

export async function addProductImageFn(req, res, next) {
  try {
    const { productId } = req.params;
    const { key, url, alt, makePrimary } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId." });
    }
    if (!key || typeof key !== "string") {
      return res.status(400).json({ message: "Image key is required." });
    }
    if (!url || typeof url !== "string") {
      return res.status(400).json({ message: "Image url is required." });
    }

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Product not found." });

    // Prevent duplicates by key
    const exists = product.images?.some((img) => img.key === key);
    if (!exists) {
      product.images = product.images || [];
      product.images.push({
        key,
        url,
        ...(alt ? { alt } : {}),
      });
    }

    // If first image, set primary index to 0
    if (product.images.length === 1) {
      product.primaryImageIndex = 0;
    }

    // Optional: make this new one the primary
    if (makePrimary === true) {
      product.primaryImageIndex = product.images.findIndex(
        (img) => img.key === key
      );
      if (product.primaryImageIndex < 0) product.primaryImageIndex = 0;
    }

    await product.save();

    return res.status(200).json({
      data: product,
    });
  } catch (err) {
    return next(err);
  }
}
