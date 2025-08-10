import mongoose from "mongoose";
const Schema = mongoose.Schema;

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

const UserSchema = new Schema(
  {
    email: { type: String, unique: true, index: true },
    passwordHash: String,
    role: {
      type: String,
      enum: ["guest", "customer", "admin", "sales"],
      default: "customer",
    },
    name: String,
    customerId: { type: mongoose.Types.ObjectId, ref: "Customer" },
    isOTPEnabled: { type: Boolean, default: false },
    addresses: [AddressSchema],
    mustChangePassword: { type: Boolean, default: false },
    tempPasswordIssuedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
