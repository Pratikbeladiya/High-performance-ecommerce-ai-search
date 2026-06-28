import express from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect, admin, optionalProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(optionalProtect, createOrder).get(protect, admin, getAllOrders);
router.route("/myorders").get(protect, getMyOrders);
router.route("/:id/status").put(protect, admin, updateOrderStatus);

export default router;
