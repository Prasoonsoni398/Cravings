import Order from "../models/order.model.js";

export const CreateOrder = async (req, res, next) => {
  try {
    const { 
      restaurantId, 
      orderItems, 
      billDetails, 
      deliveryAddress,
      paymentDetails 
    } = req.body;

    if (
      !restaurantId ||
      !orderItems?.length ||
      !billDetails ||
      !deliveryAddress
    ) {
      const error = new Error(
        "Please provide restaurant, items, bill details, and delivery address",
      );
      error.statusCode = 400;
      return next(error);
    }

    const customerId = req.user?._id || req.body.customerId;

    if (!customerId) {
      const error = new Error("User not authenticated");
      error.statusCode = 401;
      return next(error);
    }

    const newOrder = await Order.create({
      customerId,
      restaurantId,
      orderItems,
      billDetails,
      deliveryAddress,
      paymentDetails: paymentDetails || { paymentMethod: "card", paymentStatus: "pending" },
      orderStatus: "pending",
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
    const customerId = req.user?._id || req.query.customerId;

    if (!customerId) {
      const error = new Error("User not authenticated");
      error.statusCode = 401;
      return next(error);
    }

    const orders = await Order.find({ customerId }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
