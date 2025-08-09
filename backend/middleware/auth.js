import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

// auth.js
const ROLE_RANK = { guest: 0, customer: 1, sales: 2, admin: 3 };

function isAllowed(userRole, allowedRoles, hierarchical = true) {
  if (!allowedRoles.length) return true;
  if (allowedRoles.includes(userRole)) return true;
  if (!hierarchical) return false;
  const need = Math.max(...allowedRoles.map((r) => ROLE_RANK[r] ?? -1));
  return (ROLE_RANK[userRole] ?? -1) >= need; // admin >= sales/customer
}

export const requireAuth =
  (roles = [], opts = { hierarchical: true }) =>
  (req, res, next) => {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    try {
      const payload = jwt.verify(token, config.jwtSecret); // { id, role, customerId? }
      if (!isAllowed(payload.role, roles, opts.hierarchical)) {
        return res.status(403).json({ message: "Forbidden" });
      }
      req.user = payload;
      next();
    } catch {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };

export const requireOptionalAuth = () => (req, _res, next) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (token) {
    try {
      req.user = jwt.verify(token, config.jwtSecret);
    } catch {}
  }
  next();
};

// Readable guards
export const requireAdmin = requireAuth(["admin"]);
export const requireSales = requireAuth(["sales"]); // admin allowed via hierarchy
export const requireCustomer = requireAuth(["customer"]); // admin allowed via hierarchy
export const requireAdminOrSales = requireAuth(["sales"]); // same as requireSales
export const requireExactCustomer = requireAuth(["customer"], {
  hierarchical: false,
}); // block admin here
