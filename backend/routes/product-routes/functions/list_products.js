// src/routes/products/functions/listProducts.js
// import Product from "../../../models/Product.js";
// export function listProductsFn({ q, category }) {
//   const filter = { active: true };
//   if (category) filter.category = category;
//   if (q) filter.$text = { $search: q };
//   return Product.find(filter).limit(50).lean();
// }

import Product from "../../../models/Product.js";

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

export async function listProductsFn(query) {
  console.log("Query: ", query);
  const {
    q, // text search
    sku,
    category,
    active, // filters
    page = 1,
    pageSize,
    sort = "-createdAt", // e.g., "name" or "-priceMSRP"
  } = query || {};

  const pageNum = clamp(parseInt(page, 10) || 1, 1, 1e6);
  const sizeNum = clamp(parseInt(pageSize, 10) || 20, 1, 100);

  const filter = {};
  // Public catalog shows only active by default
  if (active === "false") filter.active = false;
  else filter.active = true;

  if (sku) filter.sku = sku;
  if (category) filter.category = category;

  // Text search across the existing text index (sku/name/description)
  if (q && q.trim()) {
    filter.$text = { $search: q.trim() };
  }

  // Only select fields safe for public (adjust as needed)
  const projection = {
    sku: 1,
    name: 1,
    description: 1,
    priceMSRP: 1,
    imageUrl: 1,
    images: 1,
    primaryImageIndex: 1,
    category: 1,
    uom: 1,
    sizing: 1,
    active: 1,
    createdAt: 1,
  };

  const [data, total] = await Promise.all([
    Product.find(filter)
      .select(projection)
      .sort(sort)
      .skip((pageNum - 1) * sizeNum)
      .limit(sizeNum)
      .lean(),
    Product.countDocuments(filter),
  ]);

  return {
    status: 200,
    body: {
      data,
      total,
      page: pageNum,
      pageSize: sizeNum,
      hasMore: pageNum * sizeNum < total,
    },
  };
}
