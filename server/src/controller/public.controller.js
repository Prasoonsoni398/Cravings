import Contact from "../models/contact.model.js";

import Restaurant from "../models/restaurant.model.js";
import Menu from "../models/menu.model.js";

export const ContactUsForm = async (req, res, next) => {
  try {
    const { fullName, email, phone, subject, message } = req.body;
    if (!fullName || !email || !phone || !subject || !message) {
      const error = new Error("All fields Required");
      error.statusCode = 400;
      return next(error);
    }
    const NewContactMessage = await Contact.create({
      fullName,
      email,
      phone,
      subject,
      message,
    });

    res.status(201).json({
      message: "Thanks for Contacting us! You will hear back from us soon",
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const GetRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json({
      message: "Restaurants fetched successfully",
      data: restaurants,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const GetRestaurantMenu = async (req, res, next) => {
  try {
    const { id } = req.params;
    const menu = await Menu.findOne({ restaurantId: id });
    
    res.status(200).json({
      message: "Menu fetched successfully",
      data: menu ? menu.menuItems : [],
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const GetAllDishes = async (req, res, next) => {
  try {
    const { search, category, isVeg } = req.query;
    const menus = await Menu.find().populate("restaurantId", "restaurantName address city isOpen status");
    
    let allDishes = [];
    menus.forEach((m) => {
      const rest = m.restaurantId;
      if (rest) {
        (m.menuItems || []).forEach((item) => {
          if (!item.isDeleted) {
            allDishes.push({
              _id: item._id,
              name: item.name,
              description: item.description,
              price: item.price,
              category: item.category,
              isVeg: item.isVeg,
              image: item.image,
              isTopRated: item.isTopRated,
              isRecommended: item.isRecommended,
              restaurant: {
                _id: rest._id,
                restaurantName: rest.restaurantName,
                address: rest.address,
                city: rest.city,
                isOpen: rest.isOpen,
              },
            });
          }
        });
      }
    });

    if (search) {
      const q = search.toLowerCase();
      allDishes = allDishes.filter(
        (d) =>
          d.name?.toLowerCase().includes(q) ||
          d.description?.toLowerCase().includes(q) ||
          d.category?.toLowerCase().includes(q)
      );
    }

    if (category && category !== "all") {
      allDishes = allDishes.filter(
        (d) => d.category?.toLowerCase() === category.toLowerCase()
      );
    }

    if (typeof isVeg !== "undefined" && isVeg !== "all") {
      const vegBool = isVeg === "true";
      allDishes = allDishes.filter((d) => Boolean(d.isVeg) === vegBool);
    }

    res.status(200).json({
      success: true,
      message: "Dishes fetched successfully",
      data: allDishes,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
