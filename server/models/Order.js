import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    id: { 
      type: String, 
      required: true 
    },
    name: {
       type: String, 
       required: true
       },
    price: {
       type: Number,
        required: true 
      },
    imageUrl: {
       type: String
       },
    category: { 
      type: String
     },
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // optional for guest orders (if any)
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shipping: {
      type: Number,
      required: true,
      default: 0.0,
    },
    tax: {
      type: Number,
      required: true,
      default: 0.0,
    },
    total: {
      type: Number,
      required: true,
      default: 0.0,
    },
    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered"],
      default: "Processing",
    },
    address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
