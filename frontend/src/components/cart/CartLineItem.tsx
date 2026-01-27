import { CartItem, useCartStore } from "../../store/cart.store";
import { DEFAULT_PRODUCT_IMG } from "../../lib/images";

export default function CartLineItem({ item }: { item: CartItem }) {
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="flex gap-3 py-3 border-b last:border-b-0">
      <img
        src={item.imageUrl || DEFAULT_PRODUCT_IMG}
        alt={item.name}
        className="h-16 w-16 rounded-xl border object-cover"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = DEFAULT_PRODUCT_IMG;
        }}
      />

      <div className="flex-1">
        <div className="font-medium">{item.name}</div>
        <div className="text-xs text-gray-500">
          SKU {item.sku} {item.size ? `· Size ${item.size}` : ""}
        </div>
        {item.requiresPrescription && (
          <div className="text-xs text-red-700 mt-1">Requires Rx</div>
        )}
      </div>

      <div className="w-28 text-right">
        <div className="font-semibold">${(item.price * item.qty).toFixed(2)}</div>
        <div className="text-xs text-gray-500">${item.price.toFixed(2)} ea</div>
      </div>

      <div className="flex items-center gap-2">
        <input
          className="input w-20"
          type="number"
          min={1}
          value={item.qty}
          onChange={(e) => updateQty(item.sku, Number(e.target.value), item.size)}
        />
        <button
          className="btn-outline"
          onClick={() => removeItem(item.sku, item.size)}
          type="button"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
