import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CustomerSchema = new Schema(
  {
    name: String,
    primary_email: String,
    phone: String,
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
