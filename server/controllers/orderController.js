import Order from "../models/Order.js";
import Product from "../models/Product.js";

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
        product.stock = Math.max(0, product.stock - item.quantity);
        product.status = product.stock > 5 ? "In Stock" : product.stock > 0 ? "Low Stock" : "Out of Stock";
        await product.save();
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
    }

    const createdOrder = await order.save();
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
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
