import mongoose from "mongoose";
const Schema = mongoose.Schema;

const PriceContractSchema = new Schema(
  {
    customerId: { type: mongoose.Types.ObjectId, ref: "Customer", index: true },
    sku: { type: String, index: true },
    contractPrice: Number,
  },
  { timestamps: true }
);

export default mongoose.model("PriceContract", PriceContractSchema);
