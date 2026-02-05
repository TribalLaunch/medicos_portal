import mongoose from "mongoose";
const Schema = mongoose.Schema;

const OrderItemSchema = new Schema(
  {
    sku: String,
    name: String,
    qty: Number,
    unitPrice: Number,
  },
  { _id: false },
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
  { _id: false },
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
  { _id: true, timestamps: true },
);

const PaymentSchema = new Schema({
  amount: { type: Number, required: true },
  method: {
    type: String,
    enum: ["card", "ach", "check", "wire", "cash", "other"],
    required: true,
  },
  reference: { type: String, default: null },
  notes: { type: String, default: null },
  paidAt: { type: Date, default: Date.now },
  source: {
    type: String,
    enum: ["customer_portal", "backoffice"],
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  stripeSessionId: { type: String, default: null },
  stripePaymentIntentId: { type: String, default: null },
  stripeChargeId: { type: String, default: null },
  // receiptUrl: { type: String, default: null },
});

const OrderSchema = new Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "User" },
  customerId: { type: mongoose.Types.ObjectId, ref: "Customer" },
  items: [OrderItemSchema],
  paymentMethod: {
    type: String,
    enum: ["stripe", "invoice"],
    default: "stripe",
  },
  paymentRef: String,
  shippingAddress: AddressSchema,
  billingAddress: AddressSchema,
  subtotal: Number,
  shipping: Number,
  total: Number,
  status: {
    type: String,
    enum: [
      "new",
      "processing",
      "paid",
      "shipped",
      "cancelled",
      "pending_payment",
    ],
    default: "new",
  },
  payment: {
    stripeSessionId: String,
    chargeId: String,
    paymentIntentId: String,
  },
  payments: [PaymentSchema],
  fulfillments: [FulfillmentSchema],
  events: [{ type: String }],
  source: {
    type: String,
    enum: ["backoffice", "website"],
    default: "website",
  },
  termsDays: {
    type: Number,
    default: null,
  },
  dueDate: {
    type: Date,
    default: null,
  },
  invoiceStatus: {
    type: String,
    enum: ["open", "partially_paid", "paid", "void"],
  },
  amountPaid: {
    type: Number,
  },
  balanceDue: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Order", OrderSchema);
