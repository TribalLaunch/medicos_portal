import { getItem } from "../lib/fetcher";

export type AdminCustomer = {
  _id: string;
  name: string;
  email?: string;
};

export function searchAdminCustomers(params?: { q?: string; page?: number; pageSize?: number }) {
  const p = new URLSearchParams();
  if (params?.q) p.set("q", params.q);
  if (params?.page) p.set("page", String(params.page));
  if (params?.pageSize) p.set("pageSize", String(params.pageSize));
  const qs = p.toString() ? `?${p.toString()}` : "";
  return getItem<AdminCustomer[]>(`/admin/customers${qs}`); // list returns array in our current fetcher behavior
}
