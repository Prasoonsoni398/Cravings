import express from "express";
import multer from "multer";
import {
  restaurantUpdateProfile,
  RestaurantGetData,
} from "../controller/restaurant.controller.js";
import { RestaurantAuthProtect } from "../middleware/auth.middleware.js";

const upload = multer();
const router = express.Router();

router.post(
  "/update-profile",
  RestaurantAuthProtect,
  upload.single("coverImage"),
  upload.array("restaurantImage", 10),
  restaurantUpdateProfile,
);

router.put(
  "/update-profile",
  RestaurantAuthProtect,
  upload.single("coverImage"),
  upload.array("restaurantImage", 10),
  restaurantUpdateProfile,
);

router.get("/get-restaurant-data", RestaurantAuthProtect, RestaurantGetData);
router.get("/get-resturant-data", RestaurantAuthProtect, RestaurantGetData);

export default router;
