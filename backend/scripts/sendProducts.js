import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import csv from "csv-parser";
import Product from "../src/models/Product.js";
import { config } from "../src/config/env.js";

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/seedProducts.js ./data/products.csv");
  process.exit(1);
}

async function run() {
  await mongoose.connect(config.mongoUri);
  const rows = [];
  const stream = fs.createReadStream(path.resolve(file)).pipe(csv());
  for await (const row of stream) {
    rows.push({
      sku: row.sku,
      name: row.name,
      category: row.category,
      uom: row.uom,
      description: row.description,
      priceMSRP: Number(row.priceMSRP),
      imageUrl: row.imageUrl,
      requiresPrescription: row.requiresPrescription === "true",
      active: row.active !== "false",
    });
  }
  await Product.bulkWrite(
    rows.map((doc) => ({
      updateOne: {
        filter: { sku: doc.sku },
        update: { $set: doc },
        upsert: true,
      },
    }))
  );
  console.log(`Upserted ${rows.length} products`);
  await mongoose.disconnect();
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
