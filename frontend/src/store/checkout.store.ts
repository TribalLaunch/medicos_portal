import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ShippingAddress = {
  name?: string;          // attention / contact name
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country?: string;       // default US
};

type CheckoutState = {
  // contact info
  email: string;
  phone: string;

  // shipping
  shipping: ShippingAddress;

  // if logged in and selecting a saved address
  selectedAddressId?: string;

  setEmail: (v: string) => void;
  setPhone: (v: string) => void;

  setShipping: (patch: Partial<ShippingAddress>) => void;
  setSelectedAddressId: (id?: string) => void;

  resetCheckout: () => void;
};

const initialShipping: ShippingAddress = {
  name: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  zip: "",
  country: "US",
};

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      email: "",
      phone: "",
      shipping: initialShipping,
      selectedAddressId: undefined,

      setEmail: (v) => set({ email: v }),
      setPhone: (v) => set({ phone: v }),

      setShipping: (patch) =>
        set((s) => ({
          shipping: { ...s.shipping, ...patch },
        })),

      setSelectedAddressId: (id) => set({ selectedAddressId: id }),

      resetCheckout: () =>
        set({
          email: "",
          phone: "",
          shipping: initialShipping,
          selectedAddressId: undefined,
        }),
    }),
    { name: "medicos-checkout", version: 1 }
  )
);
