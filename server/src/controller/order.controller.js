import Order from "../models/order.model.js";
import Restaurant from "../models/restaurant.model.js";
import { validateOrderTransition } from "../middleware/orderState.middleware.js";
import {
  emitToRestaurant,
  emitToAdmin,
  emitToOrder,
  emitToUser,
  emitToRider,
} from "../config/socket.config.js";

export const CreateOrder = async (req, res, next) => {
  try {
    const {
      restaurantId,
      orderItems,
      billDetails,
      deliveryAddress,
      paymentDetails,
      specialInstructions,
    } = req.body;

    if (
      !restaurantId ||
      !orderItems?.length ||
      !billDetails ||
      !deliveryAddress
    ) {
      const error = new Error(
        "Please provide restaurant, items, bill details, and delivery address"
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

    const initialStatus = "placed";
    const newOrder = await Order.create({
      customerId,
      restaurantId,
      orderItems,
      billDetails,
      deliveryAddress,
      paymentDetails: paymentDetails || {
        paymentMethod: "card",
        paymentStatus: "pending",
      },
      orderStatus: initialStatus,
      specialInstructions: specialInstructions || "",
      timeline: [
        {
          status: initialStatus,
          note: "Order placed by customer",
          timestamp: new Date(),
        },
      ],
    });

    const populatedOrder = await Order.findById(newOrder._id)
      .populate("restaurantId", "name phone address")
      .populate("customerId", "fullName email phone photo");

    // Real-time notification
    emitToRestaurant(restaurantId.toString(), "order:created", populatedOrder);
    emitToAdmin("order:created", populatedOrder);

    res.status(201).json({
      message: "Order placed successfully",
      data: populatedOrder,
    });
  } catch (error) {
    console.error("CreateOrder error:", error);
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

    const orders = await Order.find({ customerId })
      .populate("restaurantId", "name phone address coverImage restaurantImage")
      .populate("riderId", "fullName phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    console.error("GetMyOrders error:", error);
    next(error);
  }
};

export const GetOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("restaurantId", "name phone address coverImage")
      .populate("customerId", "fullName email phone photo")
      .populate({
        path: "riderId",
        populate: { path: "userId", select: "fullName phone photo" },
      });

    if (!order) {
      const error = new Error("Order not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      message: "Order fetched successfully",
      data: order,
    });
  } catch (error) {
    console.error("GetOrderById error:", error);
    next(error);
  }
};

export const UpdateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status, note, estimatedDeliveryTime } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      const error = new Error("Order not found");
      error.statusCode = 404;
      return next(error);
    }

    // Validate state machine transition
    validateOrderTransition(order.orderStatus, status);

    order.orderStatus = status;
    if (estimatedDeliveryTime) {
      order.estimatedDeliveryTime = estimatedDeliveryTime;
    }
    order.timeline.push({
      status,
      note: note || `Order updated to ${status}`,
      timestamp: new Date(),
    });

    await order.save();

    const updatedOrder = await Order.findById(orderId)
      .populate("restaurantId", "name phone address")
      .populate("customerId", "fullName email phone photo")
      .populate("riderId");

    // Broadcast status update
    emitToOrder(orderId, "order:status_updated", updatedOrder);
    emitToUser(order.customerId.toString(), "order:status_updated", updatedOrder);
    emitToRestaurant(order.restaurantId.toString(), "order:status_updated", updatedOrder);
    if (order.riderId) {
      emitToRider(order.riderId.toString(), "order:status_updated", updatedOrder);
    }
    emitToAdmin("order:status_updated", updatedOrder);

    res.status(200).json({
      message: `Order status updated to ${status}`,
      data: updatedOrder,
    });
  } catch (error) {
    console.error("UpdateOrderStatus error:", error);
    next(error);
  }
};

export const CancelOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      const error = new Error("Order not found");
      error.statusCode = 404;
      return next(error);
    }

    // Validate cancellation transition
    validateOrderTransition(order.orderStatus, "cancelled");

    order.orderStatus = "cancelled";
    order.cancellationReason = reason || "Cancelled by user";
    order.timeline.push({
      status: "cancelled",
      note: `Cancelled: ${order.cancellationReason}`,
      timestamp: new Date(),
    });

    await order.save();

    emitToOrder(orderId, "order:status_updated", order);
    emitToRestaurant(order.restaurantId.toString(), "order:status_updated", order);
    emitToUser(order.customerId.toString(), "order:status_updated", order);
    emitToAdmin("order:status_updated", order);

    res.status(200).json({
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    console.error("CancelOrder error:", error);
    next(error);
  }
};

export const RateOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      const error = new Error("Rating must be between 1 and 5");
      error.statusCode = 400;
      return next(error);
    }

    const order = await Order.findById(orderId);
    if (!order) {
      const error = new Error("Order not found");
      error.statusCode = 404;
      return next(error);
    }

    order.rating = rating;
    if (review) order.review = review;
    await order.save();

    res.status(200).json({
      message: "Rating submitted successfully",
      data: order,
    });
  } catch (error) {
    console.error("RateOrder error:", error);
    next(error);
  }
};
