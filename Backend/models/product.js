import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      // This validates the input. If it's not in this list, the DB saves nothing.
      enum: ["Electronics", "Fashion", "Sports", "Home", "Toys"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
