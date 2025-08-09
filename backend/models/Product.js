import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    sku: { type: String, unique: true, index: true },
    manufacturer: String,
    name: String,
    category: String,
    uom: String,
    description: String,
    sizing: String,
    priceMSRP: Number,
    imageUrl: String,
    requiresPrescription: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);
