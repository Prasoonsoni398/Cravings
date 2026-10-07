import express from "express";
import {
  GetRiderProfile,
  ToggleAvailability,
  UpdateLocation,
  GetAvailableOrders,
  GetMyDeliveries,
  AcceptDelivery,
  UpdateDeliveryStatus,
  GetRiderEarnings,
} from "../controller/rider.controller.js";
import { AuthProtect } from "../middleware/auth.middleware.js";
import { riderOnly } from "../middleware/roleGuard.middleware.js";

const router = express.Router();

router.use(AuthProtect, riderOnly);

router.get("/profile", GetRiderProfile);
router.patch("/toggle-availability", ToggleAvailability);
router.post("/location", UpdateLocation);

router.get("/available-orders", GetAvailableOrders);
router.get("/my-deliveries", GetMyDeliveries);
router.post("/orders/:orderId/accept", AcceptDelivery);
router.patch("/orders/:orderId/status", UpdateDeliveryStatus);
router.get("/earnings", GetRiderEarnings);

export default router;
