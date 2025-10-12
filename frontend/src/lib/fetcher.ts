import { api } from './axios';

/** Standard list response shape from your backend */
export type ListResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};

/** GET a paginated list: e.g., getList<Product>('/products', { q, page, pageSize }) */
export async function getList<T>(
  url: string,
  params?: Record<string, any>
): Promise<ListResponse<T>> {
  const { data } = await api.get<ListResponse<T>>(url, { params });
  return data;
}

/** GET a single item where server returns { data: T } */
export async function getItem<T>(url: string): Promise<T> {
  const { data } = await api.get<{ data: T }>(url);
  return data.data;
}

/** POST JSON and return server payload (generic) */
export async function postJSON<T = any>(
  url: string,
  body?: any,
  config?: Record<string, any>
): Promise<T> {
  const { data } = await api.post<T>(url, body, config);
  return data;
}

/** PATCH JSON and return server payload (generic) */
export async function patchJSON<T = any>(
  url: string,
  body?: any,
  config?: Record<string, any>
): Promise<T> {
  const { data } = await api.patch<T>(url, body, config);
  return data;
}

/** DELETE (no body) */
export async function del(url: string, config?: Record<string, any>): Promise<void> {
  await api.delete(url, config);
}
