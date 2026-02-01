import { getItem, postItem, patchItem, deleteItem } from "../lib/fetcher";
import type { Fulfillment } from "./orders.service";

export type CreateFulfillmentDto = {
  items: { sku: string; qty: number }[];
  carrier?: "UPS" | "FedEx" | "USPS" | "DHL" | "Other";
  serviceLevel?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  labelUrl?: string;
  status?: "pending" | "labeled" | "in_transit" | "delivered" | "exception";
  shippedAt?: string; // ISO
  deliveredAt?: string; // ISO
};

export function listFulfillments(orderId: string) {
  return getItem<Fulfillment[]>(`/orders/${orderId}/fulfillment`);
}

export function createFulfillment(orderId: string, dto: CreateFulfillmentDto) {
  return postItem<Fulfillment, CreateFulfillmentDto>(`/orders/${orderId}/fulfillment`, dto);
}

export function updateFulfillment(orderId: string, fulfillmentId: string, dto: Partial<CreateFulfillmentDto>) {
  return patchItem<Fulfillment, Partial<CreateFulfillmentDto>>(
    `/orders/${orderId}/fulfillment/${fulfillmentId}`,
    dto
  );
}

export function deleteFulfillment(orderId: string, fulfillmentId: string) {
  return deleteItem<{ ok: true }>(`/orders/${orderId}/fulfillment/${fulfillmentId}`);
}
