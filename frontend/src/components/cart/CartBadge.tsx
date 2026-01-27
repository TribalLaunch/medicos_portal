import { useCartStore } from "../../store/cart.store";
import { Link } from "react-router-dom";

export default function CartBadge() {
  const totalItems = useCartStore((s) => s.totalItems());
  return (
    <Link to="/checkout" className="relative inline-flex items-center gap-2 btn-outline">
      <span>Cart</span>
      <span className="badge">{totalItems}</span>
    </Link>
  );
}
