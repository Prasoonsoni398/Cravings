import express from "express";
import {
  GetAdminStats,
  GetAllOrders,
  AdminUpdateOrderStatus,
  GetAllRestaurants,
  UpdateRestaurantStatus,
  GetAllUsers,
  UpdateUserStatus,
  GetAllRiders,
  UpdateRiderStatus,
  GetAllComplaints,
  ResolveComplaint,
  GetAllCoupons,
  CreateCoupon,
  ToggleCoupon,
  GetAuditLogs,
} from "../controller/admin.controller.js";
import { AuthProtect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/roleGuard.middleware.js";

const router = express.Router();

// Apply auth and admin check to all admin routes
router.use(AuthProtect, adminOnly);

router.get("/stats", GetAdminStats);
router.get("/orders", GetAllOrders);
router.patch("/orders/:orderId/status", AdminUpdateOrderStatus);

router.get("/restaurants", GetAllRestaurants);
router.patch("/restaurants/:restaurantId/status", UpdateRestaurantStatus);

router.get("/users", GetAllUsers);
router.patch("/users/:userId/status", UpdateUserStatus);

router.get("/riders", GetAllRiders);
router.patch("/riders/:riderDocId/status", UpdateRiderStatus);

router.get("/complaints", GetAllComplaints);
router.patch("/complaints/:complaintId/resolve", ResolveComplaint);

router.get("/coupons", GetAllCoupons);
router.post("/coupons", CreateCoupon);
router.patch("/coupons/:couponId/toggle", ToggleCoupon);

router.get("/audit-logs", GetAuditLogs);

export default router;
