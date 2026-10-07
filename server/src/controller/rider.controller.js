import Rider from "../models/rider.model.js";
import Order from "../models/order.model.js";
import RiderLocation from "../models/riderLocation.model.js";
import { validateOrderTransition } from "../middleware/orderState.middleware.js";
import {
  emitToOrder,
  emitToRestaurant,
  emitToUser,
  emitToAdmin,
} from "../config/socket.config.js";

export const GetRiderProfile = async (req, res, next) => {
  try {
    let rider = await Rider.findOne({ riderId: req.user._id }).populate(
      "riderId",
      "fullName email phone photo"
    );

    // If profile doesn't exist yet, create initial rider profile
    if (!rider) {
      rider = await Rider.create({
        riderId: req.user._id,
        vehicleDetails: {
          vehicleType: "Bike",
          vehicleNumber: "MP-04-XX-0000",
          vehicleModel: "Standard",
          vehicleColor: "Black",
        },
        documents: {
          drivingLicense: "Pending",
          vehicleRegistrationCertificate: "Pending",
          insuranceCertificate: "Pending",
          aadharCard: "Pending",
          panCard: "Pending",
        },
        currentAddress: {
          address: "City Center",
          city: "Bhopal",
          state: "Madhya Pradesh",
          pinCode: "462001",
          country: "India",
        },
        status: "active",
        isAvailable: true,
      });
      rider = await Rider.findById(rider._id).populate(
        "riderId",
        "fullName email phone photo"
      );
    }

    res.status(200).json({ success: true, data: rider });
  } catch (error) {
    next(error);
  }
};

export const ToggleAvailability = async (req, res, next) => {
  try {
    const rider = await Rider.findOne({ riderId: req.user._id });
    if (!rider) {
      const error = new Error("Rider profile not found");
      error.statusCode = 404;
      return next(error);
    }

    rider.isAvailable = !rider.isAvailable;
    await rider.save();

    res.status(200).json({
      success: true,
      message: `Status updated to ${rider.isAvailable ? "Online" : "Offline"}`,
      isAvailable: rider.isAvailable,
    });
  } catch (error) {
    next(error);
  }
};

export const UpdateLocation = async (req, res, next) => {
  try {
    const { coordinates, heading = 0, speed = 0, currentOrderId } = req.body;
    if (!coordinates?.lat || !coordinates?.lng) {
      const error = new Error("Coordinates (lat, lng) are required");
      error.statusCode = 400;
      return next(error);
    }

    const rider = await Rider.findOne({ riderId: req.user._id });
    if (!rider) {
      const error = new Error("Rider profile not found");
      error.statusCode = 404;
      return next(error);
    }

    // Save location to DB
    const locationDoc = await RiderLocation.findOneAndUpdate(
      { riderId: rider._id },
      {
        coordinates,
        heading,
        speed,
        currentOrderId: currentOrderId || null,
      },
      { upsert: true, new: true }
    );

    // Relay location to active order room and admin
    if (currentOrderId) {
      emitToOrder(currentOrderId, "rider:location_update", {
        riderId: rider._id,
        orderId: currentOrderId,
        coordinates,
        heading,
        speed,
      });
    }

    emitToAdmin("rider:location_update", {
      riderId: rider._id,
      coordinates,
      updatedAt: new Date(),
    });

    res.status(200).json({ success: true, data: locationDoc });
  } catch (error) {
    next(error);
  }
};

export const GetAvailableOrders = async (req, res, next) => {
  try {
    // Orders ready or preparing that don't have a rider assigned yet
    const orders = await Order.find({
      orderStatus: { $in: ["ready_for_pickup", "ready", "preparing"] },
      $or: [{ riderId: null }, { riderId: { $exists: false } }],
    })
      .populate("restaurantId", "restaurantName phone address coverImage")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

export const GetMyDeliveries = async (req, res, next) => {
  try {
    const rider = await Rider.findOne({ riderId: req.user._id });
    if (!rider) {
      return res.status(200).json({ success: true, data: [] });
    }

    const orders = await Order.find({ riderId: rider._id })
      .populate("restaurantId", "restaurantName phone address")
      .populate("customerId", "fullName phone email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

export const AcceptDelivery = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const rider = await Rider.findOne({ riderId: req.user._id });
    if (!rider) {
      const error = new Error("Rider profile not found");
      error.statusCode = 404;
      return next(error);
    }

    const order = await Order.findById(orderId);
    if (!order) {
      const error = new Error("Order not found");
      error.statusCode = 404;
      return next(error);
    }

    if (order.riderId) {
      const error = new Error("Order already assigned to another rider");
      error.statusCode = 409;
      return next(error);
    }

    order.riderId = rider._id;
    order.orderStatus = "rider_assigned";
    order.timeline.push({
      status: "rider_assigned",
      note: `Assigned to rider ${req.user.fullName}`,
      timestamp: new Date(),
    });

    await order.save();

    const populatedOrder = await Order.findById(orderId)
      .populate("restaurantId", "restaurantName phone address")
      .populate("customerId", "fullName phone")
      .populate({ path: "riderId", populate: { path: "riderId", select: "fullName phone" } });

    emitToOrder(orderId, "order:status_updated", populatedOrder);
    emitToUser(order.customerId.toString(), "order:status_updated", populatedOrder);
    emitToRestaurant(order.restaurantId.toString(), "order:status_updated", populatedOrder);

    res.status(200).json({
      success: true,
      message: "Order delivery accepted successfully",
      data: populatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const UpdateDeliveryStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status, note } = req.body;

    const allowedRiderStatuses = [
      "rider_arrived",
      "picked_up",
      "pickedUp",
      "out_for_delivery",
      "outForDelivery",
      "delivered",
      "undeliverable",
    ];

    if (!allowedRiderStatuses.includes(status)) {
      const error = new Error("Invalid status update for delivery rider");
      error.statusCode = 400;
      return next(error);
    }

    const rider = await Rider.findOne({ riderId: req.user._id });
    const order = await Order.findOne({ _id: orderId, riderId: rider._id });

    if (!order) {
      const error = new Error("Order not found or not assigned to you");
      error.statusCode = 404;
      return next(error);
    }

    validateOrderTransition(order.orderStatus, status);

    order.orderStatus = status;
    if (status === "delivered" && order.paymentDetails?.paymentMethod === "cod") {
      order.paymentDetails.paymentStatus = "completed";
    }

    order.timeline.push({
      status,
      note: note || `Rider status updated: ${status}`,
      timestamp: new Date(),
    });

    await order.save();

    const updatedOrder = await Order.findById(orderId)
      .populate("restaurantId", "restaurantName phone address")
      .populate("customerId", "fullName phone");

    emitToOrder(orderId, "order:status_updated", updatedOrder);
    emitToUser(order.customerId.toString(), "order:status_updated", updatedOrder);
    emitToRestaurant(order.restaurantId.toString(), "order:status_updated", updatedOrder);

    res.status(200).json({
      success: true,
      message: `Delivery updated to ${status}`,
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const GetRiderEarnings = async (req, res, next) => {
  try {
    const rider = await Rider.findOne({ riderId: req.user._id });
    if (!rider) {
      return res.status(200).json({ success: true, data: { totalEarnings: 0, completedOrders: 0 } });
    }

    const completedOrders = await Order.find({
      riderId: rider._id,
      orderStatus: "delivered",
    });

    // Fixed fee per delivery + distance payout simulation (e.g. ₹40 per delivery)
    const perDeliveryPayout = 40;
    const totalEarnings = completedOrders.length * perDeliveryPayout;

    res.status(200).json({
      success: true,
      data: {
        completedOrdersCount: completedOrders.length,
        totalEarnings,
        perDeliveryPayout,
        deliveries: completedOrders.slice(-10),
      },
    });
  } catch (error) {
    next(error);
  }
};
