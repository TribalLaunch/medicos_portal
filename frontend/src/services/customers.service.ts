import { getItem } from "../lib/fetcher";

export type CustomerAddress = {
  _id: string;
  label?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
};

export type Customer = {
  _id: string;
  name: string;
  addresses: CustomerAddress[];
};

export function getMyCustomer() {
  // expects backend: { data: customer }
  return getItem<Customer>("/customers/me");
}
