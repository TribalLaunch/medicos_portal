import { getItem } from "../lib/fetcher";

export type AdminCustomer = {
  _id: string;
  customer_name: string;
  customer_number?: string;
  email?: string;
};

export function searchAdminCustomers(params?: { q?: string; page?: number; pageSize?: number }) {
  const p = new URLSearchParams();
  if (params?.q) p.set("q", params.q);
  if (params?.page) p.set("page", String(params.page));
  if (params?.pageSize) p.set("pageSize", String(params.pageSize));
  const qs = p.toString() ? `?${p.toString()}` : "";

  // NOTE: because your fetcher unwraps to array, this returns AdminCustomer[]
  return getItem<AdminCustomer[]>(`/admin/customers${qs}`);
}
