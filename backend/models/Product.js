import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ImageSchema = new mongoose.Schema(
  {
    key: String, // S3 key (images/products/SKU/...jpg)
    url: String, // CloudFront URL
    alt: String,
  },
  { _id: false }
);

const ProductSchema = new Schema(
  {
    sku: { type: String, unique: true, index: true },
    manufacturer: String,
    name: String,
    category: String,
    sub_category: {
      type: String,
      enum: [
        "Bracing",
        "Ear",
        "Knee",
        "Ankle",
        "Shoulder",
        "Elbow",
        "Pregnancy",
        "Face",
        "Chest",
        "Foot",
      ],
    },
    uom: String, //unit of measurement
    description: String,
    sizing: [{ type: String }],
    sizing_description: String,
    priceMSRP: Number,
    images: [ImageSchema],
    primaryImageIndex: { type: Number, default: 0 },
    requiresPrescription: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", description: "text", sku: "text" });

export default mongoose.model("Product", ProductSchema);
