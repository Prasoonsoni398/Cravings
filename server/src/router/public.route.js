import express from "express";
import {
  ContactUsForm,
  GetRestaurants,
  GetRestaurantMenu,
  GetAllDishes,
} from "../controller/public.controller.js";

const router = express.Router();

router.get("/restaurants", GetRestaurants);
router.get("/restaurants/:id/menu", GetRestaurantMenu);
router.get("/dishes", GetAllDishes);
router.post("/contact", ContactUsForm);
router.post("/contactUs", ContactUsForm);

export default router;
