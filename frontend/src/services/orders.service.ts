import { getItem, postItem } from "../lib/fetcher";

// Order Fields & Functions
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
  status: string;
  createdAt: string;
  source?: "backoffice" | "website";

  customerId?: string;
  email?: string;

  customerName?: string;
  customerNumber?: string;

  items: OrderLineItem[];

  subtotal?: number;
  shipping?: number;
  tax?: number;
  total?: number;

  fulfillments?: Fulfillment[];
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


export type ReceiptResponse = { receiptUrl: string };

export function getOrderReceiptUrl(orderId: string) {
  return getItem<ReceiptResponse>(`/orders/${orderId}/receipt`);
}


// Fulfillment Fields & Functions
export type FulfillmentItem = { sku: string; qty: number };

export type FulfillmentEvent = {
  at?: string;
  code?: string;
  description?: string;
  location?: string;
};

export type Fulfillment = {
  _id: string;
  items: FulfillmentItem[];
  carrier?: "UPS" | "FedEx" | "USPS" | "DHL" | "Other";
  serviceLevel?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  labelUrl?: string;
  status?: "pending" | "labeled" | "in_transit" | "delivered" | "exception";
  shippingCost?: number;
  weight?: number;
  dimensions?: { l?: number; w?: number; h?: number };
  fromAddress?: {
    name?: string;
    line1?: string;
    city?: string;
    state?: string;
    postal?: string;
    country?: string;
  };
  toAddress?: {
    name?: string;
    line1?: string;
    city?: string;
    state?: string;
    postal?: string;
    country?: string;
  };
  shippedAt?: string;
  deliveredAt?: string;
  events?: FulfillmentEvent[];
  createdAt?: string;
  updatedAt?: string;
};