import { getItem } from "../lib/fetcher";
import type { Product } from "../lib/validators/product";

export function searchProducts(params: { q: string; pageSize?: number }) {
  const p = new URLSearchParams();
  p.set("q", params.q);
  p.set("page", "1");
  p.set("pageSize", String(params.pageSize ?? 10));
  return getItem<Product[]>(`/products?${p.toString()}`); // returns array (fetcher unwrap)
}
