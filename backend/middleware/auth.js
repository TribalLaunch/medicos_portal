import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

export const requireAuth =
  (roles = []) =>
  (req, res, next) => {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    try {
      const payload = jwt.verify(token, config.jwtSecret);
      if (roles.length && !roles.includes(payload.role))
        return res.status(403).json({ message: "Forbidden" });
      req.user = payload;
      next();
    } catch {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
