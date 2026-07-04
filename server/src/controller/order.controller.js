import Order from "../models/order.model.js";

export const CreateOrder = async (req, res, next) => {
  try {
    const { restaurantId, restaurantName, items, totalPrice, deliveryAddress } = req.body;

    if (!restaurantId || !restaurantName || !items?.length || !deliveryAddress) {
      const error = new Error("Please provide restaurant, items, and delivery address");
      error.statusCode = 400;
      return next(error);
    }

    const newOrder = await Order.create({
      userId: req.user?._id || req.body.userId,
      restaurantId,
      restaurantName,
      items,
      totalPrice,
      deliveryAddress,
    });

    res.status(201).json({
      message: "Order placed successfully",
      data: newOrder,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const GetMyOrders = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.query.userId;

    if (!userId) {
      const error = new Error("User not authenticated");
      error.statusCode = 401;
      return next(error);
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
