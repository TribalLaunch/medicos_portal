// src/routes/products/products.controller.js
import { listProductsFn } from "./functions/list_products.js";
import { getProductFn } from "./functions/get_product.js";

export async function listProducts(req, res, next) {
  try {
    const { q, category } = req.query;
    res.json(await listProductsFn({ q, category }));
  } catch (e) {
    next(e);
  }
}

export async function getProduct(req, res, next) {
  try {
    const p = await getProductFn(req.params.sku);
    if (!p) return res.status(404).json({ message: "Not found" });
    res.json(p);
  } catch (e) {
    next(e);
  }
}
