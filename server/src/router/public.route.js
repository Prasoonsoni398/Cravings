import express from "express";
import { ContactUsForm, GetRestaurants } from "../controller/public.controller.js";

const router = express.Router();

router.get("/restaurants", GetRestaurants);
router.post("/contact", ContactUsForm);
router.post("/contactUs", ContactUsForm);

export default router;
