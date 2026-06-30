import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      default: 0.0,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["In Stock", "Low Stock", "Out of Stock"],
      default: "In Stock",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    stock: {
      type: Number,
      required: [true, "Stock level is required"],
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    aiEmbeddingsContext: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
