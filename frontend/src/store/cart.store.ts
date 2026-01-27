import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  sku: string;
  name: string;
  price: number;            // price used in cart (MSRP or contract)
  qty: number;
  size?: string;
  imageUrl?: string;
  requiresPrescription?: boolean;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty"> & { qty?: number }) => void;
  removeItem: (sku: string, size?: string) => void;
  updateQty: (sku: string, qty: number, size?: string) => void;
  clearCart: () => void;

  // helpers
  subtotal: () => number;
  totalItems: () => number;
};

function itemKey(sku: string, size?: string) {
  return `${sku}::${size || ""}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const qtyToAdd = Math.max(1, item.qty ?? 1);

        set((state) => {
          const k = itemKey(item.sku, item.size);
          const idx = state.items.findIndex((x) => itemKey(x.sku, x.size) === k);

          if (idx >= 0) {
            const next = [...state.items];
            next[idx] = { ...next[idx], qty: next[idx].qty + qtyToAdd };
            return { items: next };
          }

          return {
            items: [
              ...state.items,
              {
                sku: item.sku,
                name: item.name,
                price: item.price,
                qty: qtyToAdd,
                size: item.size,
                imageUrl: item.imageUrl,
                requiresPrescription: item.requiresPrescription,
              },
            ],
          };
        });
      },

      removeItem: (sku, size) => {
        set((state) => ({
          items: state.items.filter((x) => !(x.sku === sku && (x.size || "") === (size || ""))),
        }));
      },

      updateQty: (sku, qty, size) => {
        const safeQty = Math.max(1, Math.floor(qty || 1));
        set((state) => ({
          items: state.items.map((x) =>
            x.sku === sku && (x.size || "") === (size || "")
              ? { ...x, qty: safeQty }
              : x
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      subtotal: () => {
        const { items } = get();
        return items.reduce((sum, x) => sum + x.price * x.qty, 0);
      },

      totalItems: () => {
        const { items } = get();
        return items.reduce((sum, x) => sum + x.qty, 0);
      },
    }),
    {
      name: "medicos-cart",
      version: 1,
    }
  )
);
