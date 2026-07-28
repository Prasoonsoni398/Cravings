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
