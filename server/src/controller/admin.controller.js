import Order from "../models/order.model.js";
import Restaurant from "../models/restaurant.model.js";
import User from "../models/user.model.js";
import Rider from "../models/rider.model.js";
import Complaint from "../models/complaint.model.js";
import Coupon from "../models/coupon.model.js";
import AuditLog from "../models/auditLog.model.js";
import { emitToOrder, emitToRestaurant, emitToUser } from "../config/socket.config.js";

export const GetAdminStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalCustomers = await User.countDocuments({ userType: "customer" });
    const totalRestaurants = await Restaurant.countDocuments();
    const activeRestaurants = await Restaurant.countDocuments({ status: "active" });
    const totalRiders = await Rider.countDocuments();
    const activeRiders = await Rider.countDocuments({ status: "active" });

    // Aggregate revenue
    const revenueAgg = await Order.aggregate([
      {
        $match: {
          $or: [
            { "paymentDetails.paymentStatus": "completed" },
            { orderStatus: "delivered" },
          ],
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$billDetails.finalAmount" },
        },
      },
    ]);
    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    // Order status breakdown
    const statusAgg = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
        },
      },
    ]);
    const ordersByStatus = statusAgg.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    // Recent 10 orders
    const recentOrders = await Order.find()
      .populate("restaurantId", "restaurantName")
      .populate("customerId", "fullName email")
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        totalUsers,
        totalCustomers,
        totalRestaurants,
        activeRestaurants,
        totalRiders,
        activeRiders,
        ordersByStatus,
        recentOrders,
      },
    });
  } catch (error) {
    console.error("GetAdminStats error:", error);
    next(error);
  }
};

export const GetAllOrders = async (req, res, next) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    const query = {};
    if (status && status !== "all") {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .populate("restaurantId", "restaurantName phone address")
      .populate("customerId", "fullName email phone")
      .populate({
        path: "riderId",
        populate: { path: "riderId", select: "fullName phone" },
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: orders,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("GetAllOrders error:", error);
    next(error);
  }
};

export const AdminUpdateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status, note } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      const error = new Error("Order not found");
      error.statusCode = 404;
      return next(error);
    }

    const previousStatus = order.orderStatus;
    order.orderStatus = status;
    order.timeline.push({
      status,
      note: note || `Admin override status changed from ${previousStatus} to ${status}`,
      timestamp: new Date(),
    });
    await order.save();

    // Create Audit Log
    await AuditLog.create({
      actorId: req.user?._id,
      actorEmail: req.user?.email || "Admin",
      actorRole: "admin",
      action: "ORDER_STATUS_OVERRIDE",
      targetModel: "order",
      targetId: order._id,
      details: { previousStatus, newStatus: status, note },
    });

    emitToOrder(orderId, "order:status_updated", order);
    emitToRestaurant(order.restaurantId.toString(), "order:status_updated", order);
    emitToUser(order.customerId.toString(), "order:status_updated", order);

    res.status(200).json({
      success: true,
      message: `Order status overridden to ${status}`,
      data: order,
    });
  } catch (error) {
    console.error("AdminUpdateOrderStatus error:", error);
    next(error);
  }
};

export const GetAllRestaurants = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const query = {};
    if (status && status !== "all") {
      query.status = status;
    }
    if (search) {
      query.restaurantName = { $regex: search, $options: "i" };
    }

    const restaurants = await Restaurant.find(query)
      .populate("managerId", "fullName email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: restaurants,
    });
  } catch (error) {
    console.error("GetAllRestaurants error:", error);
    next(error);
  }
};

export const UpdateRestaurantStatus = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const { status } = req.body;

    if (!["active", "inactive", "blocked"].includes(status)) {
      const error = new Error("Invalid restaurant status value");
      error.statusCode = 400;
      return next(error);
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      { status },
      { new: true }
    );

    if (!restaurant) {
      const error = new Error("Restaurant not found");
      error.statusCode = 404;
      return next(error);
    }

    await AuditLog.create({
      actorId: req.user?._id,
      actorEmail: req.user?.email || "Admin",
      actorRole: "admin",
      action: "RESTAURANT_STATUS_UPDATE",
      targetModel: "restaurant",
      targetId: restaurantId,
      details: { newStatus: status },
    });

    res.status(200).json({
      success: true,
      message: `Restaurant status updated to ${status}`,
      data: restaurant,
    });
  } catch (error) {
    console.error("UpdateRestaurantStatus error:", error);
    next(error);
  }
};

export const GetAllUsers = async (req, res, next) => {
  try {
    const { userType, status, search } = req.query;
    const query = {};
    if (userType && userType !== "all") query.userType = userType;
    if (status && status !== "all") query.status = status;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("GetAllUsers error:", error);
    next(error);
  }
};

export const UpdateUserStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { status, isActive } = req.body;

    const updateFields = {};
    if (status) updateFields.status = status;
    if (typeof isActive === "boolean") updateFields.isActive = isActive;

    const user = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    }).select("-password");

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    await AuditLog.create({
      actorId: req.user?._id,
      actorEmail: req.user?.email || "Admin",
      actorRole: "admin",
      action: "USER_STATUS_UPDATE",
      targetModel: "User",
      targetId: userId,
      details: updateFields,
    });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("UpdateUserStatus error:", error);
    next(error);
  }
};

export const GetAllRiders = async (req, res, next) => {
  try {
    const riders = await Rider.find()
      .populate("riderId", "fullName email phone photo status isActive")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: riders,
    });
  } catch (error) {
    console.error("GetAllRiders error:", error);
    next(error);
  }
};

export const UpdateRiderStatus = async (req, res, next) => {
  try {
    const { riderDocId } = req.params;
    const { status } = req.body;

    if (!["active", "inactive", "blocked"].includes(status)) {
      const error = new Error("Invalid rider status value");
      error.statusCode = 400;
      return next(error);
    }

    const rider = await Rider.findByIdAndUpdate(
      riderDocId,
      { status },
      { new: true }
    ).populate("riderId", "fullName email phone");

    if (!rider) {
      const error = new Error("Rider profile not found");
      error.statusCode = 404;
      return next(error);
    }

    await AuditLog.create({
      actorId: req.user?._id,
      actorEmail: req.user?.email || "Admin",
      actorRole: "admin",
      action: "RIDER_STATUS_UPDATE",
      targetModel: "rider",
      targetId: riderDocId,
      details: { newStatus: status },
    });

    res.status(200).json({
      success: true,
      message: `Rider status updated to ${status}`,
      data: rider,
    });
  } catch (error) {
    console.error("UpdateRiderStatus error:", error);
    next(error);
  }
};

export const GetAllComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find()
      .populate("userId", "fullName email phone userType")
      .populate("orderId", "orderStatus billDetails")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: complaints,
    });
  } catch (error) {
    console.error("GetAllComplaints error:", error);
    next(error);
  }
};

export const ResolveComplaint = async (req, res, next) => {
  try {
    const { complaintId } = req.params;
    const { status, adminNotes } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      complaintId,
      {
        status: status || "resolved",
        adminNotes: adminNotes || "",
        resolvedBy: req.user?._id,
        resolvedAt: new Date(),
      },
      { new: true }
    );

    if (!complaint) {
      const error = new Error("Complaint not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "Complaint updated successfully",
      data: complaint,
    });
  } catch (error) {
    console.error("ResolveComplaint error:", error);
    next(error);
  }
};

export const GetAllCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: coupons,
    });
  } catch (error) {
    console.error("GetAllCoupons error:", error);
    next(error);
  }
};

export const CreateCoupon = async (req, res, next) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      maxDiscount,
      minOrderAmount,
      validUntil,
      usageLimit,
    } = req.body;

    if (!code || !discountValue || !validUntil) {
      const error = new Error("Coupon code, discount value, and valid date are required");
      error.statusCode = 400;
      return next(error);
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      description: description || `Flat / ${discountValue}% off`,
      discountType: discountType || "percentage",
      discountValue: Number(discountValue),
      maxDiscount: Number(maxDiscount) || 0,
      minOrderAmount: Number(minOrderAmount) || 0,
      validUntil: new Date(validUntil),
      usageLimit: Number(usageLimit) || 1000,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: coupon,
    });
  } catch (error) {
    console.error("CreateCoupon error:", error);
    next(error);
  }
};

export const ToggleCoupon = async (req, res, next) => {
  try {
    const { couponId } = req.params;
    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
      const error = new Error("Coupon not found");
      error.statusCode = 404;
      return next(error);
    }

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    res.status(200).json({
      success: true,
      message: `Coupon ${coupon.isActive ? "activated" : "deactivated"} successfully`,
      data: coupon,
    });
  } catch (error) {
    console.error("ToggleCoupon error:", error);
    next(error);
  }
};

export const GetAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
    res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error) {
    console.error("GetAuditLogs error:", error);
    next(error);
  }
};
