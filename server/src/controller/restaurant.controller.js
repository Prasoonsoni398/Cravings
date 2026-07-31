import Restaurant from "../models/restaurant.model.js";
import {
  uploadMultipleImages,
  deleteMultipleImages,
  UploadSingleImage,
  deleteSingleImage,
} from "../utils/image.service.js";
import Menu from "../models/menu.model.js";

export const RestaurantGetData = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const managerId = req.query.id;

    console.log("Current User:", currentUser);
    console.log("Manager ID:", managerId);

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
    console.log("RestaurantAddMenuItem error:", error);
    next(error);
  }
};

export const RestaurantUpdateProfile = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const restaurantDataFromFE = req.body;
    const coverImageFromFE = req.files?.coverImage;
    const restaurantImageFromFE = req.files?.restaurantImage;

    const dataKeys = Object.keys(restaurantDataFromFE);

    dataKeys.forEach((key) => {
      if (!restaurantDataFromFE[key]) {
        const error = new Error(`Missing required field: ${key}`);
        error.statusCode = 400;
        return next(error);
      }
    });

    const existingRestaurant = await Restaurant.findOne({
      managerId: currentUser._id,
    });

    if (!existingRestaurant) {
      if (coverImageFromFE && coverImageFromFE.length > 0) {
        const coverImage = await UploadSingleImage(
          coverImageFromFE[0],
          `restaurant/${currentUser.phone}/coverPhoto`,
        );
        dataKeys.push("coverImage");
        restaurantDataFromFE.coverImage = coverImage;
      }

      if (restaurantImageFromFE && restaurantImageFromFE.length > 0) {
        const restaurantImage = await uploadMultipleImages(
          restaurantImageFromFE,
          `restaurant/${currentUser.phone}/restaurantPhotos`,
        );
        dataKeys.push("restaurantImage");
        restaurantDataFromFE.restaurantImage = restaurantImage;
      }

      const newRestaurant = await Restaurant.create({
        managerId: currentUser._id,
        ...restaurantDataFromFE,
      });
      return res.status(201).json({
        message: "Restaurant profile created successfully",
        data: newRestaurant,
      });
    } else {
      if (coverImageFromFE && coverImageFromFE.length > 0) {
        await deleteSingleImage(existingRestaurant.coverImage);

        const coverImage = await UploadSingleImage(
          coverImageFromFE[0],
          `restaurant/${currentUser.phone}/coverPhoto`,
        );
        dataKeys.push("coverImage");
        restaurantDataFromFE.coverImage = coverImage;
      }
      if (restaurantImageFromFE && restaurantImageFromFE.length > 0) {
        await deleteMultipleImages(existingRestaurant.restaurantImage);

        const restaurantImage = await uploadMultipleImages(
          restaurantImageFromFE,
          `restaurant/${currentUser.phone}/restaurantPhotos`,
        );
        dataKeys.push("restaurantImage");
        restaurantDataFromFE.restaurantImage = restaurantImage;
      }
      dataKeys.forEach((key) => {
        existingRestaurant[key] =
          restaurantDataFromFE[key] || existingRestaurant[key];
      });
      await existingRestaurant.save();
      return res.status(200).json({
        message: "Restaurant profile updated successfully",
        data: existingRestaurant,
      });
    }
  } catch (error) {
    console.log(error.message);
    next();
  }
};

export const RestaurantUpdateInfo = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const {
      restaurantName,
      description,
      restaurantType,
      cuisineTypes,
      contactEmail,
      contactPhone,
      openingTime,
      closingTime,
    } = req.body;

    if (
      !restaurantName ||
      !description ||
      !restaurantType ||
      !cuisineTypes ||
      !contactEmail ||
      !contactPhone ||
      !openingTime ||
      !closingTime
    ) {
      const error = new Error("All fields are required");
      error.statusCode = 400;
      return next(error);
    }

    const cuisineTypesArray = cuisineTypes
      .split(",")
      .map((type) => type.trim());
    const existingRestaurant = await Restaurant.findOne({
      managerId: currentUser._id,
    });
    if (!existingRestaurant) {
      const newRestaurant = await Restaurant.create({
        managerId: currentUser._id,
        restaurantName,
        description,
        restaurantType,
        cuisineTypes: cuisineTypesArray,
        contactDetails: {
          email: contactEmail,
          phone: contactPhone,
        },
        servingHours: {
          openingTime,
          closingTime,
        },
      });
      return res.status(201).json({
        message: "Restaurant profile created successfully",
        data: newRestaurant,
      });
    } else {
      existingRestaurant.restaurantName = restaurantName;
      existingRestaurant.description = description;
      existingRestaurant.restaurantType = restaurantType;
      existingRestaurant.cuisineTypes = cuisineTypesArray;
      existingRestaurant.contactDetails.email = contactEmail;
      existingRestaurant.contactDetails.phone = contactPhone;
      existingRestaurant.servingHours.openingTime = openingTime;
      existingRestaurant.servingHours.closingTime = closingTime;
      await existingRestaurant.save();
      return res.status(200).json({
        message: "Restaurant profile updated successfully",
        data: existingRestaurant,
      });
    }
  } catch (error) {
    console.log(error.message);
    next();
  }
};

export const OpenRestaurant = async (req, res, next) => {
  try {
    const currentUser = req.user;

    const OpenStatus = req.params.openStatus;

    console.log("Open Status is", OpenStatus);

    const existingRestaurant = await Restaurant.findOne({
      managerId: currentUser._id,
    });

    if (!existingRestaurant) {
      const error = new Error("Restaurant Not Found");
      error.statusCode = 404;
      return next(error);
    }

    existingRestaurant.isOpen = OpenStatus;

    await existingRestaurant.save();

    return res.status(200).json({
      message: `${OpenStatus === "true" ? "Restaurant is Live Now" : "Restaurant is Offline"}`,
      data: existingRestaurant,
    });
  } catch (error) {
    console.log(error.message);
    next();
  }
};

export const RestaurantAddMenuItem = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const {
      itemName,
      description,
      price,
      category,
      foodType,
      status,
      isTopRated,
      isRecommended,
      isNew,
      isDeleted,
    } = req.body;
    const itemImageFromFE = req.file;

    console.log("Received data:", {
      itemName,
      description,
      price,
      category,
      foodType,
      status,
      isTopRated,
      isRecommended,
      isNew,
      isDeleted,
      itemImageFromFE,
    });

    if (
      !itemName ||
      !description ||
      !price ||
      !category ||
      !foodType ||
      !status
    ) {
      const error = new Error("All fields are required");
      error.statusCode = 400;
      return next(error);
    }

    if (!itemImageFromFE) {
      const error = new Error("Item image is required");
      error.statusCode = 400;
      return next(error);
    }

    const existingRestaurant = await Restaurant.findOne({
      managerId: currentUser._id,
    });
    if (!existingRestaurant) {
      const error = new Error("Restaurant Not Found");
      error.statusCode = 404;
      return next(error);
    }

    console.log("Lets UploadImage");

    const itemImage = await UploadSingleImage(
      itemImageFromFE,
      `restaurant/${currentUser.phone}/menuItems`,
    );

    console.log("itemImage after upload:", itemImage);

    const existingMenuItem = await Menu.findOne({
      restaurantId: existingRestaurant._id,
    });

    console.log("Lets Add the Menu");

    if (existingMenuItem) {
      const isDuplicate = existingMenuItem.menuItems.some(
        (item) => item.itemName.toLowerCase() === itemName.toLowerCase(),
      );

      if (isDuplicate) {
        const error = new Error(
          "An item with this name already exists on the menu.",
        );
        error.statusCode = 409;
        return next(error);
      }

      existingMenuItem.menuItems.push({
        itemName,
        description,
        price,
        category,
        foodType,
        status,
        isTopRated,
        isRecommended,
        isNew,
        isDeleted,
        image: itemImage,
      });

      console.log("Existing Menu Item after push");
      await existingMenuItem.save();
      return res.status(200).json({
        message: "Menu item added successfully",
        data: existingMenuItem,
      });
    } else {
      const newItem = {
        itemName,
        description,
        price,
        category,
        foodType,
        status,
        isTopRated,
        isRecommended,
        isNew,
        isDeleted,
        image: itemImage,
      };

      console.log("New Item to be added");
      const newMenuItem = await Menu.create({
        restaurantId: existingRestaurant._id,
        menuItems: [newItem],
      });

      return res.status(201).json({
        message: "Menu item added successfully",
        data: newMenuItem,
      });
    }
  } catch (error) {
    console.log(error.message);
    next();
  }
};

export const RestaurantGetMenuItems = async (req, res, next) => {
  try {
    const currentUser = req.user;

    const existingRestaurant = await Restaurant.findOne({
      managerId: currentUser._id,
    });

    if (!existingRestaurant) {
      const error = new Error("Restaurant Not Found");
      error.statusCode = 404;
      return next(error);
    }

    const menu = await Menu.findOne({
      restaurantId: existingRestaurant._id,
    });

    if (menu) {
      res.status(200).json({
        message: "Menu items fetched successfully",
        data: menu.menuItems,
      });
    } else {
      res.status(200).json({
        message: "No menu items found",
        data: [],
      });
    }
  } catch (error) {
    console.log("RestaurantGetMenuItems error:", error);
    next(error);
  }
};

export const RestaurantEditMenuItem = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const itemId = req.params.itemId;
    const { itemName, description, price, category, foodType, status } =
      req.body;
    const itemImageFromFE = req.file;

    const existingRestaurant = await Restaurant.findOne({
      managerId: currentUser._id,
    });
    if (!existingRestaurant) {
      const error = new Error("Restaurant Not Found");
      error.statusCode = 404;
      return next(error);
    }

    const menu = await Menu.findOne({ restaurantId: existingRestaurant._id });
    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    const menuItemIndex = menu.menuItems.findIndex(
      (item) => item._id.toString() === itemId,
    );
    if (menuItemIndex === -1) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    const menuItem = menu.menuItems[menuItemIndex];
    menuItem.itemName = itemName || menuItem.itemName;
    menuItem.description = description || menuItem.description;
    menuItem.price = price || menuItem.price;
    menuItem.category = category || menuItem.category;
    menuItem.foodType = foodType || menuItem.foodType;
    menuItem.status = status || menuItem.status;

    if (itemImageFromFE) {
      const newImage = await UploadSingleImage(
        itemImageFromFE,
        `restaurant/${currentUser.phone}/menuItems`,
      );
      menuItem.image = newImage;
    }

    menu.markModified("menuItems");
    await menu.save();
    return res
      .status(200)
      .json({
        message: "Menu item updated successfully",
        data: menu.menuItems,
      });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const RestaurantDeleteMenuItem = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const itemId = req.params.itemId;

    const existingRestaurant = await Restaurant.findOne({
      managerId: currentUser._id,
    });
    if (!existingRestaurant) {
      const error = new Error("Restaurant Not Found");
      error.statusCode = 404;
      return next(error);
    }

    const menu = await Menu.findOne({ restaurantId: existingRestaurant._id });
    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    menu.menuItems = menu.menuItems.filter(
      (item) => item._id.toString() !== itemId,
    );

    await menu.save();
    return res
      .status(200)
      .json({
        message: "Menu item deleted successfully",
        data: menu.menuItems,
      });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const RestaurantUpdateMenuItemFlags = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const itemId = req.params.itemId;
    const { isTopRated, isRecommended, isNew, status } = req.body;

    const existingRestaurant = await Restaurant.findOne({
      managerId: currentUser._id,
    });
    if (!existingRestaurant) {
      const error = new Error("Restaurant Not Found");
      error.statusCode = 404;
      return next(error);
    }

    const menu = await Menu.findOne({ restaurantId: existingRestaurant._id });
    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    const menuItemIndex = menu.menuItems.findIndex(
      (item) => item._id.toString() === itemId,
    );
    if (menuItemIndex === -1) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    const menuItem = menu.menuItems[menuItemIndex];
    if (isTopRated !== undefined) menuItem.isTopRated = isTopRated;
    if (isRecommended !== undefined) menuItem.isRecommended = isRecommended;
    if (isNew !== undefined) menuItem.isNew = isNew;
    if (status !== undefined) menuItem.status = status;

    menu.markModified("menuItems");
    await menu.save();
    return res
      .status(200)
      .json({
        message: "Menu item flags updated successfully",
        data: menu.menuItems,
      });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const RestaurantUpdateAddress = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const { address, city, state, pinCode, country, geoLat, geoLon } = req.body;

    const existingRestaurant = await Restaurant.findOne({
      managerId: currentUser._id,
    });
    if (!existingRestaurant) {
      const error = new Error("Restaurant Not Found");
      error.statusCode = 404;
      return next(error);
    }

    existingRestaurant.address = address !== undefined ? address : existingRestaurant.address;
    existingRestaurant.city = city !== undefined ? city : existingRestaurant.city;
    existingRestaurant.state = state !== undefined ? state : existingRestaurant.state;
    existingRestaurant.pinCode = pinCode !== undefined ? pinCode : existingRestaurant.pinCode;
    existingRestaurant.country = country !== undefined ? country : existingRestaurant.country;
    
    if (geoLat !== undefined || geoLon !== undefined) {
      existingRestaurant.geoLocation = {
        lat: geoLat !== undefined ? geoLat : existingRestaurant.geoLocation?.lat,
        lon: geoLon !== undefined ? geoLon : existingRestaurant.geoLocation?.lon,
      };
    }

    await existingRestaurant.save();
    return res.status(200).json({
      message: "Address updated successfully",
      data: existingRestaurant,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const RestaurantUpdateBankingAndDocs = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const { bankName, accountNumber, ifscCode, panCard, gst, fssai } = req.body;

    const existingRestaurant = await Restaurant.findOne({
      managerId: currentUser._id,
    });
    if (!existingRestaurant) {
      const error = new Error("Restaurant Not Found");
      error.statusCode = 404;
      return next(error);
    }

    if (!existingRestaurant.financialDetails) existingRestaurant.financialDetails = {};
    existingRestaurant.financialDetails.bankName = bankName !== undefined ? bankName : existingRestaurant.financialDetails.bankName;
    existingRestaurant.financialDetails.accountNumber = accountNumber !== undefined ? accountNumber : existingRestaurant.financialDetails.accountNumber;
    existingRestaurant.financialDetails.ifscCode = ifscCode !== undefined ? ifscCode : existingRestaurant.financialDetails.ifscCode;

    if (!existingRestaurant.documents) existingRestaurant.documents = {};
    existingRestaurant.documents.panCard = panCard !== undefined ? panCard : existingRestaurant.documents.panCard;
    existingRestaurant.documents.gstCertificate = gst !== undefined ? gst : existingRestaurant.documents.gstCertificate;
    existingRestaurant.documents.fssaiCertificate = fssai !== undefined ? fssai : existingRestaurant.documents.fssaiCertificate;

    await existingRestaurant.save();
    return res.status(200).json({
      message: "Banking and documents updated successfully",
      data: existingRestaurant,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const RestaurantUpdateLegalInfo = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const { legalName, companyType } = req.body;

    const existingRestaurant = await Restaurant.findOne({
      managerId: currentUser._id,
    });
    if (!existingRestaurant) {
      const error = new Error("Restaurant Not Found");
      error.statusCode = 404;
      return next(error);
    }

    if (!existingRestaurant.documents) existingRestaurant.documents = {};
    existingRestaurant.documents.legalName = legalName !== undefined ? legalName : existingRestaurant.documents.legalName;
    existingRestaurant.documents.companyType = companyType !== undefined ? companyType : existingRestaurant.documents.companyType;

    await existingRestaurant.save();
    return res.status(200).json({
      message: "Legal information updated successfully",
      data: existingRestaurant,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const RestaurantUpdateSocialMedia = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const { socialMediaLinks } = req.body; // Expecting an array of objects

    const existingRestaurant = await Restaurant.findOne({
      managerId: currentUser._id,
    });
    if (!existingRestaurant) {
      const error = new Error("Restaurant Not Found");
      error.statusCode = 404;
      return next(error);
    }

    if (socialMediaLinks !== undefined) {
      existingRestaurant.socialMediaLinks = socialMediaLinks;
    }

    await existingRestaurant.save();
    return res.status(200).json({
      message: "Social media links updated successfully",
      data: existingRestaurant,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const RestaurantUpdateCoverImage = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const coverImageFromFE = req.file;

    const existingRestaurant = await Restaurant.findOne({
      managerId: currentUser._id,
    });
    if (!existingRestaurant) {
      const error = new Error("Restaurant Not Found");
      error.statusCode = 404;
      return next(error);
    }

    if (coverImageFromFE) {
      if (existingRestaurant.coverImage && existingRestaurant.coverImage.publicId) {
        await deleteSingleImage(existingRestaurant.coverImage);
      }
      
      const coverImage = await UploadSingleImage(
        coverImageFromFE,
        `restaurant/${currentUser.phone}/coverPhoto`,
      );
      existingRestaurant.coverImage = coverImage;
      await existingRestaurant.save();
      
      return res.status(200).json({
        message: "Cover image updated successfully",
        data: existingRestaurant,
      });
    } else {
      const error = new Error("No cover image provided");
      error.statusCode = 400;
      return next(error);
    }
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const RestaurantUpdateGalleryImages = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const restaurantImagesFromFE = req.files;

    if (!restaurantImagesFromFE || restaurantImagesFromFE.length === 0) {
      const error = new Error("No images provided");
      error.statusCode = 400;
      return next(error);
    }

    const existingRestaurant = await Restaurant.findOne({
      managerId: currentUser._id,
    });
    if (!existingRestaurant) {
      const error = new Error("Restaurant Not Found");
      error.statusCode = 404;
      return next(error);
    }

    const newImages = await uploadMultipleImages(
      restaurantImagesFromFE,
      `restaurant/${currentUser.phone}/restaurantPhotos`,
    );

    if (!existingRestaurant.restaurantImage) {
      existingRestaurant.restaurantImage = [];
    }

    existingRestaurant.restaurantImage.push(...newImages);
    await existingRestaurant.save();

    return res.status(200).json({
      message: "Gallery images updated successfully",
      data: existingRestaurant,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const RestaurantDeleteGalleryImage = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const imageId = req.params.imageId; // This will be the publicId

    const existingRestaurant = await Restaurant.findOne({
      managerId: currentUser._id,
    });
    if (!existingRestaurant) {
      const error = new Error("Restaurant Not Found");
      error.statusCode = 404;
      return next(error);
    }

    if (!existingRestaurant.restaurantImage) {
      return res.status(404).json({ message: "No images found" });
    }

    const imageToDelete = existingRestaurant.restaurantImage.find(img => img.publicId === imageId);
    if (!imageToDelete) {
      return res.status(404).json({ message: "Image not found" });
    }

    await deleteSingleImage(imageToDelete);

    existingRestaurant.restaurantImage = existingRestaurant.restaurantImage.filter(img => img.publicId !== imageId);
    await existingRestaurant.save();

    return res.status(200).json({
      message: "Gallery image deleted successfully",
      data: existingRestaurant,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};
