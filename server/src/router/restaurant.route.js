import express from "express";
import multer from "multer";
import {
  RestaurantUpdateProfile,
  RestaurantGetData,
  RestaurantUpdateInfo,
  OpenRestaurant,
  RestaurantAddMenuItem,
  RestaurantGetMenuItems,
  RestaurantEditMenuItem,
  RestaurantDeleteMenuItem,
  RestaurantUpdateMenuItemFlags,
  RestaurantUpdateAddress,
  RestaurantUpdateBankingAndDocs,
  RestaurantUpdateLegalInfo,
  RestaurantUpdateSocialMedia,
  RestaurantUpdateCoverImage,
  RestaurantUpdateGalleryImages,
  RestaurantDeleteGalleryImage,
} from "../controller/restaurant.controller.js";
import { RestaurantAuthProtect } from "../middleware/auth.middleware.js";

const upload = multer();
const router = express.Router();

router.post(
  "/update-profile",
  RestaurantAuthProtect,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "restaurantImage", maxCount: 10 },
  ]),
  RestaurantUpdateProfile,
); 


router.put(
  "/update-profile",
  RestaurantAuthProtect,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "restaurantImage", maxCount: 8 },
  ]),
  RestaurantUpdateProfile,
);
 
router.get("/get-restaurant-data", RestaurantAuthProtect, RestaurantGetData);
router.put(
  "/update-restaurant-info",
  RestaurantAuthProtect,
  RestaurantUpdateInfo,
);

router.put("/update-address", RestaurantAuthProtect, RestaurantUpdateAddress);
router.put("/update-banking-documents", RestaurantAuthProtect, RestaurantUpdateBankingAndDocs);
router.put("/update-legal-info", RestaurantAuthProtect, RestaurantUpdateLegalInfo);
router.put("/update-social-media", RestaurantAuthProtect, RestaurantUpdateSocialMedia);

router.put("/update-cover-image", RestaurantAuthProtect, upload.single("coverImage"), RestaurantUpdateCoverImage);
router.put("/update-gallery-images", RestaurantAuthProtect, upload.array("restaurantImages", 8), RestaurantUpdateGalleryImages);
router.delete("/delete-gallery-image/:imageId", RestaurantAuthProtect, RestaurantDeleteGalleryImage);

router.patch(
  "/change-open-status/:openStatus",
  RestaurantAuthProtect,
  OpenRestaurant,
);

//Menu Routes

router.post(
  "/add-menu-item",
  RestaurantAuthProtect,
  upload.single("itemImage"),
  RestaurantAddMenuItem,
);

router.get("/get-menu-items", RestaurantAuthProtect, RestaurantGetMenuItems);

router.put(
  "/edit-menu-item/:itemId",
  RestaurantAuthProtect,
  upload.single("itemImage"),
  RestaurantEditMenuItem,
);

router.delete(
  "/delete-menu-item/:itemId",
  RestaurantAuthProtect,
  RestaurantDeleteMenuItem,
);

router.patch(
  "/update-menu-item-flags/:itemId",
  RestaurantAuthProtect,
  RestaurantUpdateMenuItemFlags,
);

export default router;
