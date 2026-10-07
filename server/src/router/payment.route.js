import express from "express";
import {
  GetRazorpayKey,
  CreateRazorpayOrder,
  VerifyPayment,
} from "../controller/payment.controller.js";
import { AuthProtect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/key", GetRazorpayKey);
router.post("/create-order", AuthProtect, CreateRazorpayOrder);
router.post("/verify", AuthProtect, VerifyPayment);

export default router;
