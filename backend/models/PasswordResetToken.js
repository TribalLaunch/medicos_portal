import mongoose from "mongoose";
const Schema = mongoose.Schema;

const PasswordResetTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      index: true,
      required: true,
    },
    tokenHash: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true },
    usedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Optional: TTL index (Mongo will purge past 2 days automatically)
PasswordResetTokenSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 2 }
);

export default mongoose.model("PasswordResetToken", PasswordResetTokenSchema);
