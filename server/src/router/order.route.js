import express from "express";
import { CreateOrder, GetMyOrders } from "../controller/order.controller.js";
import { AuthProtect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", AuthProtect, CreateOrder);
router.get("/my", AuthProtect, GetMyOrders);

export default router;
