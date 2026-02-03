import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CustomerSchema = new Schema(
  {
    customer_name: String,
    primary_email: String,
    phone: String,
    customer_number: { type: String, unique: true, sparse: true },
    user_type: {
      type: String,
      enum: ["Clinic", "Hospital", "Patient", "Other"],
      default: "Clinic",
    },
    allowInvoice: {
      type: Boolean,
      default: false,
    },
    termsDays: {
      type: Number,
      default: null,
    },
    invoiceEmail: {
      type: String,
      default: null,
    },
    creditLimit: {
      type: Number,
      default: null,
    },
    salesRepId: { type: mongoose.Types.ObjectId, ref: "User", index: true }, // assigned Sales user
    addresses: [
      {
        label: String,
        line1: String,
        line2: String,
        city: String,
        state: String,
        zip: String,
        country: String,
        isDefault: Boolean,
      },
    ],
  },
  { timestamps: true },
);

CustomerSchema.index({ customer_name: "text", customer_number: "text" });

export default mongoose.model("Customer", CustomerSchema);
