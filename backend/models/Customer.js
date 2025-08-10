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
    salesRepId: { type: mongoose.Types.ObjectId, ref: "User", index: true }, // assigned Sales user
    address: [
      {
        label: String,
        line1: String,
        line2: String,
        city: String,
        state: String,
        zip: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Customer", CustomerSchema);
