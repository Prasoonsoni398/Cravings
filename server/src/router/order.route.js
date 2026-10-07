import express from "express";
import {
  CreateOrder,
  GetMyOrders,
  GetOrderById,
  UpdateOrderStatus,
  CancelOrder,
  RateOrder,
} from "../controller/order.controller.js";
import { AuthProtect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", AuthProtect, CreateOrder);
router.get("/my", AuthProtect, GetMyOrders);
router.get("/:orderId", AuthProtect, GetOrderById);
router.patch("/:orderId/status", AuthProtect, UpdateOrderStatus);
router.patch("/:orderId/cancel", AuthProtect, CancelOrder);
router.post("/:orderId/rate", AuthProtect, RateOrder);

export default router;
