import express from "express";
import {
  GetAddresses,
  AddAddress,
  UpdateAddress,
  DeleteAddress,
  CreateReview,
  CreateComplaint,
  GetMyComplaints,
  GetNotifications,
} from "../controller/customer.controller.js";
import { AuthProtect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(AuthProtect);

// Addresses
router.get("/addresses", GetAddresses);
router.post("/addresses", AddAddress);
router.put("/addresses/:addressId", UpdateAddress);
router.delete("/addresses/:addressId", DeleteAddress);

// Reviews & Complaints
router.post("/reviews", CreateReview);
router.post("/complaints", CreateComplaint);
router.get("/complaints", GetMyComplaints);

// Notifications
router.get("/notifications", GetNotifications);

export default router;
