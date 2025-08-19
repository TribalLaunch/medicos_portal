import mongoose from "mongoose";
const Schema = mongoose.Schema;

const OrderItemSchema = new Schema(
  {
    sku: String,
    name: String,
    qty: Number,
    unitPrice: Number,
  },
  { _id: false }
);

const AddressSchema = new Schema(
  {
    label: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    zip: String,
  },
  { _id: false }
);

const FulfillmentSchema = new mongoose.Schema(
  {
    items: [{ sku: String, qty: Number }],
    carrier: { type: String, enum: ["UPS", "FedEx", "USPS", "DHL", "Other"] },
    serviceLevel: String,
    trackingNumber: { type: String, index: true },
    trackingUrl: String,
    labelUrl: String,
    status: {
      type: String,
      enum: ["pending", "labeled", "in_transit", "delivered", "exception"],
      default: "pending",
    },
    shippingCost: Number,
    weight: Number,
    dimensions: { l: Number, w: Number, h: Number },
    fromAddress: {
      name: String,
      line1: String,
      city: String,
      state: String,
      postal: String,
      country: String,
    },
    toAddress: {
      name: String,
      line1: String,
      city: String,
      state: String,
      postal: String,
      country: String,
    },
    shippedAt: Date,
    deliveredAt: Date,
    events: [{ at: Date, code: String, description: String, location: String }],
  },
  { _id: true, timestamps: true }
);

const OrderSchema = new Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "User" },
  customerId: { type: mongoose.Types.ObjectId, ref: "Customer" },
  items: [OrderItemSchema],
  paymentMethod: {
    type: String,
    enum: ["stripe", "manual", "po", "net_terms", "cash", "check"],
    default: "stripe",
  },
  paymentRef: String, // Optional reference (check, PO/invoice number)
  shippingAddress: AddressSchema,
  billingAddress: AddressSchema,
  subtotal: Number,
  shipping: Number,
  total: Number,
  status: {
    type: String,
    enum: ["new", "processing", "paid", "shipped", "cancelled"],
    default: "new",
  },
  stripeSessionId: String,
  fulfillments: [FulfillmentSchema],
  events: [{ type: String }],
  source: {
    type: String,
    enum: ["backoffice", "website"],
    default: "website",
  },
});

export default mongoose.model("Order", OrderSchema);
