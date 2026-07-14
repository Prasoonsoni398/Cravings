import Restaurant from "../models/restaurant.model.js";
import {
  uploadMultipleImages,
  deleteMultipleImages,
  UploadSingleImage,
  deleteSingleImage,
} from "../utils/image.service.js";


export const RestaurantGetData = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const managerId = req.query.id;

    if (currentUser._id.toString() !== managerId) {
      const error = new Error("Unauthorized Access");
      error.statusCode = 401;
      return next(error);
    }

    const restaurantData = await Restaurant.findOne({ managerId });

    if (restaurantData) {
      res.status(200).json({
        message: "Restaurant Fetched Successfully",
        data: restaurantData,
      });
    } else {
      res.status(200).json({
        message: "No restaurant Data Found",
        data: {},
      });
    }
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const restaurantUpdateProfile = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const formData = { ...req.body };
    const normalizedData = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      if (typeof value === "string") {
        const trimmedValue = value.trim();

        if (!trimmedValue) return;

        if (["geoLocation", "documents", "financialDetails", "contactDetails", "servingHours", "socialMediaLinks"].includes(key)) {
          try {
            normalizedData[key] = JSON.parse(trimmedValue);
          } catch {
            normalizedData[key] = trimmedValue;
          }
        } else if (key === "cuisineTypes") {
          try {
            normalizedData[key] = JSON.parse(trimmedValue);
          } catch {
            normalizedData[key] = trimmedValue
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean);
          }
        } else if (key === "isOpen") {
          normalizedData[key] = trimmedValue === "true";
        } else {
          normalizedData[key] = trimmedValue;
        }
      } else {
        normalizedData[key] = value;
      }
    });

    const coverImageFromFE = req.files?.coverImage;
    const restaurantImageFromFE = req.files?.restaurantImage;

    const existingRestaurant = await Restaurant.findOne({
      managerId: currentUser._id,
    });

    if (!existingRestaurant) {
      if (coverImageFromFE) {
        const coverImage = await UploadSingleImage(
          coverImageFromFE,
          `restaurant/${currentUser.phone}/coverPhoto`,
        );
        normalizedData.coverImage = coverImage;
      }

      if (restaurantImageFromFE && restaurantImageFromFE.length > 0) {
        const restaurantImage = await uploadMultipleImages(
          restaurantImageFromFE,
          `restaurant/${currentUser.phone}/restaurantPhotos`,
        );
        normalizedData.restaurantImage = restaurantImage;
      }

      const newRestaurant = await Restaurant.create({
        managerId: currentUser._id,
        ...normalizedData,
      });

      return res.status(201).json({
        message: "Restaurant profile created successfully",
        data: newRestaurant,
      });
    }

    if (coverImageFromFE) {
      if (existingRestaurant.coverImage) {
        await deleteSingleImage(existingRestaurant.coverImage);
      }

      const coverImage = await UploadSingleImage(
        coverImageFromFE,
        `restaurant/${currentUser.phone}/coverPhoto`,
      );
      normalizedData.coverImage = coverImage;
    }

    if (restaurantImageFromFE && restaurantImageFromFE.length > 0) {
      if (existingRestaurant.restaurantImage?.length) {
        await deleteMultipleImages(existingRestaurant.restaurantImage);
      }

      const restaurantImage = await uploadMultipleImages(
        restaurantImageFromFE,
        `restaurant/${currentUser.phone}/restaurantPhotos`,
      );
      normalizedData.restaurantImage = restaurantImage;
    }

    Object.entries(normalizedData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        existingRestaurant[key] = value;
      }
    });

    await existingRestaurant.save();

    return res.status(200).json({
      message: "Restaurant profile updated successfully",
      data: existingRestaurant,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};