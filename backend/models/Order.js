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

const OrderSchema = new Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "User" },
  customerId: { type: mongoose.Types.ObjectId, ref: "Customer" },
  items: [OrderItemSchema],
  shippingAddress: AddressSchema,
  subtotal: Number,
  shipping: Number,
  total: Number,
  status: {
    type: String,
    enum: ["new", "processing", "paid", "shipped", "cancelled"],
    default: "new",
  },
  stripeSessionId: String,
  events: [{ type: String }],
});

export default mongoose.model("Order", OrderSchema);
