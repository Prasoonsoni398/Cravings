import express from "express";
import multer from "multer";
import {
  RestaurantUpdateProfile,
  RestaurantGetData,
  RestaurantUpdateInfo,
  OpenRestaurant
} from "../controller/restaurant.controller.js";
import { RestaurantAuthProtect } from "../middleware/auth.middleware.js";

const upload = multer();
const router = express.Router();

router.post(
  "/update-profile",
  RestaurantAuthProtect,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "restaurantImage", maxCount: 10 }
  ]),
  RestaurantUpdateProfile,
);

router.put(
  "/update-profile",
  RestaurantAuthProtect,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "restaurantImage", maxCount: 8 }
  ]),
  RestaurantUpdateProfile,
);

router.get("/get-restaurant-data", RestaurantAuthProtect, RestaurantGetData);
router.put(
  "/update-restaurant-info",
  RestaurantAuthProtect,
  RestaurantUpdateInfo,
);

router.patch(
  "/change-open-status/:openStatus",
  RestaurantAuthProtect,
  OpenRestaurant,
);

export default router;
