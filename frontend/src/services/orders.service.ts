import { getItem, postItem } from "../lib/fetcher";

export type OrderLineItem = {
  sku: string;
  name: string;
  qty: number;
  unitPrice: number;
  size?: string;
};

export type Order = {
  _id: string;
  orderNumber?: string;
  status: string; // pending, paid, shipped, etc.
  createdAt: string;

  customerId?: string;
  email?: string;

  items: OrderLineItem[];

  subtotal?: number;
  shipping?: number;
  tax?: number;
  total?: number;
};

export type PagedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};

export function listMyOrders(params?: {
  page?: number;
  pageSize?: number;
}) {
  const p = new URLSearchParams();
  if (params?.page) p.set("page", String(params.page));
  if (params?.pageSize) p.set("pageSize", String(params.pageSize));
  const qs = p.toString() ? `?${p.toString()}` : "";
  return getItem<Order[]>(`/orders${qs}`);
}

export function listAdminOrders(params?: {
  page?: number;
  pageSize?: number;
  status?: string;
  q?: string;
}) {
  const p = new URLSearchParams();
  if (params?.page) p.set("page", String(params.page));
  if (params?.pageSize) p.set("pageSize", String(params.pageSize));
  if (params?.status) p.set("status", params.status);
  if (params?.q) p.set("q", params.q);
  const qs = p.toString() ? `?${p.toString()}` : "";
  return getItem<Order[]>(`/admin/orders${qs}`);
}

export function getOrderById(id: string) {
  return getItem<Order>(`/orders/${id}`);
}

export type CreateManualOrderPayload = {
  customerId: string;
  orderType: "manual" | "po";
  poNumber?: string;

  // optional contact/shipping if your backend stores it
  email?: string;
  shippingAddress?: {
    name?: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country?: string;
  };

  items: Array<{
    sku: string;
    name?: string;
    qty: number;
    price?: number; // allow backend to compute from product/contract if omitted
    size?: string;
  }>;
};

export type CreateManualOrderResponse = {
  _id: string;
  status: string;
};

export function createAdminOrder(payload: CreateManualOrderPayload) {
  return postItem<CreateManualOrderResponse, CreateManualOrderPayload>(
    "/orders",
    payload
  );
}