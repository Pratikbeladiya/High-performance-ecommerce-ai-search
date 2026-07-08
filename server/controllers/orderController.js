import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
import { logActivity } from "../utils/activityLogger.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (Optional auth for checkout)
export const createOrder = async (req, res) => {
  try {
    const { items, subtotal, shipping, tax, total, address, orderId } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    // Process order and deduct stock
    for (const item of items) {
      const product = await Product.findById(item.product.id || item.product._id);
      if (product) {
        const oldStock = product.stock;
        product.stock = Math.max(0, product.stock - item.quantity);
        product.status = product.stock > 5 ? "In Stock" : product.stock > 0 ? "Low Stock" : "Out of Stock";
        await product.save();

        if (product.stock !== oldStock) {
          if (product.stock === 0) {
            await logActivity(null, `Out of stock: "${product.name}" stock count reached 0.`, "inventory", "danger");
          } else if (product.stock <= 5 && oldStock > 5) {
            await logActivity(null, `Low stock alert: "${product.name}" is down to ${product.stock} items.`, "inventory", "warning");
          }
        }
      }
    }

    const order = new Order({
      orderId,
      items,
      subtotal,
      shipping,
      tax,
      total,
      address,
      status: "Processing",
    });

    // If request contains authorization header (user is logged in)
    if (req.user) {
      order.user = req.user._id;
      
      // Clear user's cart after order creation
      try {
        await Cart.findOneAndUpdate(
          { user: req.user._id },
          { items: [] },
          { new: true }
        );
      } catch (err) {
        console.error("Error clearing cart after order:", err);
      }
    }

    const createdOrder = await order.save();
    
    // Log new order
    await logActivity(
      req.user?._id || null,
      `New order #${createdOrder.orderId || createdOrder._id} received for ${createdOrder.items.reduce((acc, item) => acc + item.quantity, 0)}x products ($${createdOrder.total.toFixed(2)}).`,
      "order",
      "success"
    );

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!["Processing", "Shipped", "Delivered"].includes(status)) {
      return res.status(400).json({ message: "Invalid order status value" });
    }

    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status;
      const updatedOrder = await order.save();
      await logActivity(
        req.user?._id,
        `Order #${updatedOrder.orderId || updatedOrder._id} status updated to "${status}".`,
        "order",
        "info"
      );
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
