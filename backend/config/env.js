import dotenv from "dotenv";
dotenv.config({ path: ".env.dev" });

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  stripeSecret: process.env.STRIPE_SECRET_KEY,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM || "no-reply@medicos.com",
  },
  flatRateShipping: Number(process.env.FLAT_RATE_SHIPPING || 0),
};
