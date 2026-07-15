import express from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All cart routes require authentication
router.use(protect);

router.route("/").get(getCart).delete(clearCart);
router.post("/items", addToCart);
router.delete("/items/:productId", removeFromCart);
router.put("/items/:productId", updateCartItemQuantity);

export default router;
