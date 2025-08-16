// src/server.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

import { config } from "./config/env.js";
import { errorHandler } from "./middleware/error.js";

// Routers
import healthRoutes from "./routes/health-routes/routes.js";
import authRoutes from "./routes/auth-routes/auth.routes.js";
import productRoutes from "./routes/product-routes/products.routes.js";
import checkoutRoutes from "./routes/checkout-routes/checkout.routes.js";
import orderRoutes from "./routes/order-routes/orders.routes.js";
import adminRoutes from "./routes/admin-routes/admin.routes.js";
import stripeWebhookRoutes from "./routes/webhooks/stripe.routes.js";
import salesRoutes from "./routes/sales-routes/sales.routes.js";

const app = express();

// --- Optional: Heroku/Proxy awareness ---
app.set("trust proxy", 1);

// --- Stripe webhook needs raw body on EXACT route ---
// Apply raw body ONLY to the webhook path, BEFORE JSON parser
app.use("/api/webhooks/stripe", bodyParser.raw({ type: "application/json" }));

// --- JSON for everything else ---
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// --- CORS ---
const allowedOrigins = [config.clientUrl].filter(Boolean);
app.use(
  cors({
    origin: (origin, cb) => {
      // Allow same-origin / tools without Origin and the configured client
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// --- Common middleware ---
app.use(cookieParser());
app.use(morgan("dev"));

// --- Routes ---
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/sales", salesRoutes);

// Mount the webhook router AFTER raw-body middleware registration above
// stripe.routes.js defines r.post('/stripe', stripeWebhook)
app.use("/api/webhooks", stripeWebhookRoutes);

// --- 404 fallback for API ---
app.use("/api", (_req, res) => res.status(404).json({ message: "Not found" }));

// --- Error handler (last) ---
app.use(errorHandler);

// --- Optional: Serve frontend build in production ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
  const clientBuild = path.resolve(__dirname, "../frontend/build");
  app.use(express.static(clientBuild));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientBuild, "index.html"));
  });
}

// --- Start server AFTER Mongo connects ---
function startHttpServer() {
  const port = Number(config.port || 5000);
  app.listen(port, () => {
    console.log(`✅ API listening on: ${port}`);
  });
}

mongoose
  .connect(config.mongoUri)
  .then(() => {
    console.log("✅ MongoDB connected");
    startHttpServer();
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error", err);
    process.exit(1);
  });

// --- Graceful shutdown ---
process.on("SIGINT", async () => {
  console.log("\nShutting down gracefully...");
  try {
    await mongoose.connection.close();
  } finally {
    process.exit(0);
  }
});
