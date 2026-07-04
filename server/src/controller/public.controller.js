import Contact from "../models/contact.model.js";

const restaurants = [
  {
    id: "mango-tree",
    name: "Under The Mango Tree",
    rating: "4.6",
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=80",
    description:
      "Enjoy grills, barbecue, and classic Indian favourites in a relaxed dining experience.",
    cuisines: ["Indian", "Chinese", "Italian"],
    city: "Bhopal",
    deliveryTime: "25-35 min",
    price: "₹300 for two",
    menu: ["Paneer Tikka", "Dal Makhani", "Butter Naan", "Veg Biryani"],
  },
  {
    id: "raj-darbar",
    name: "Raj Darbar",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80",
    description:
      "A family-friendly dhaba-style restaurant serving rich Indian flavours and comfort meals.",
    cuisines: ["Indian", "Chinese", "Italian"],
    city: "Indore",
    deliveryTime: "20-30 min",
    price: "₹250 for two",
    menu: ["Shahi Paneer", "Tandoori Roti", "Jeera Rice", "Gulab Jamun"],
  },
  {
    id: "countryside-culture",
    name: "Countryside Culture",
    rating: "4.1",
    image:
      "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=900&q=80",
    description:
      "A peaceful spot with fresh food, cozy ambience, and easy-going countryside charm.",
    cuisines: ["Indian", "Chinese"],
    city: "Ujjain",
    deliveryTime: "30-40 min",
    price: "₹400 for two",
    menu: ["Hakka Noodles", "Veg Manchurian", "Masala Dosa", "Cold Coffee"],
  },
];

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

    res
      .status(201)
      .json({
        message: "Thanks for Contacting us! You will hear back from us soon",
      });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const GetRestaurants = async (req, res, next) => {
  try {
    res.status(200).json({
      message: "Restaurants fetched successfully",
      data: restaurants,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};