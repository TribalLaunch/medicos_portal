import { api } from './axios';

function extractErrorMessage(err: any) {
  return err?.response?.data?.message || err?.message || "Request failed";
}

export type ListResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};

export async function getList<T>(
  url: string,
  params?: Record<string, any>
): Promise<ListResponse<T>> {
  const { data } = await api.get(url, { params });
  // unwrap if server wraps in { status, body: {...} }
  const payload = data?.body ?? data;
  return payload as ListResponse<T>;
}

export async function getItem<T>(url: string): Promise<T> {
  const { data } = await api.get(url);
  const payload = data?.body ?? data;
  // server item shape is either { data: T } or directly T
  return (payload?.data ?? payload) as T;
}

export async function getJSON<T>(url: string): Promise<T> {
  const res = await api.get(url);
  return res.data as T; // no unwrapping
}

export async function postJSON<T = any>(
  url: string,
  body?: any,
  config?: Record<string, any>
): Promise<T> {
  const { data } = await api.post(url, body, config);
  return (data?.body ?? data) as T;
}

export async function patchJSON<T = any>(
  url: string,
  body?: any,
  config?: Record<string, any>
): Promise<T> {
  const { data } = await api.patch(url, body, config);
  return (data?.body ?? data) as T;
}

export async function del(url: string, config?: Record<string, any>): Promise<void> {
  await api.delete(url, config);
}

export async function postItem<T, B = unknown>(
  url: string,
  body: B
): Promise<T> {
  const res = await api.post(url, body);
  return res.data?.data ?? res.data;
}



// import { api } from './axios';

// /** Standard list response shape from your backend */
// export type ListResponse<T> = {
//   data: T[];
//   total: number;
//   page: number;
//   pageSize: number;
//   hasMore: boolean;
// };

// /** GET a paginated list: e.g., getList<Product>('/products', { q, page, pageSize }) */
// export async function getList<T>(
//   url: string,
//   params?: Record<string, any>
// ): Promise<ListResponse<T>> {
//   const { data } = await api.get<ListResponse<T>>(url, { params });
//   return data;
// }

// /** GET a single item where server returns { data: T } */
// export async function getItem<T>(url: string): Promise<T> {
//   const { data } = await api.get<{ data: T }>(url);
//   return data.data;
// }

// /** POST JSON and return server payload (generic) */
// export async function postJSON<T = any>(
//   url: string,
//   body?: any,
//   config?: Record<string, any>
// ): Promise<T> {
//   const { data } = await api.post<T>(url, body, config);
//   return data;
// }

// /** PATCH JSON and return server payload (generic) */
// export async function patchJSON<T = any>(
//   url: string,
//   body?: any,
//   config?: Record<string, any>
// ): Promise<T> {
//   const { data } = await api.patch<T>(url, body, config);
//   return data;
// }

// /** DELETE (no body) */
// export async function del(url: string, config?: Record<string, any>): Promise<void> {
//   await api.delete(url, config);
// }
