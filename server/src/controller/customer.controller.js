import Address from "../models/address.model.js";
import Review from "../models/review.model.js";
import Complaint from "../models/complaint.model.js";
import Notification from "../models/notification.model.js";
import Order from "../models/order.model.js";

export const GetAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.find({ userId: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
    res.status(200).json({ success: true, data: addresses });
  } catch (error) {
    next(error);
  }
};

export const AddAddress = async (req, res, next) => {
  try {
    const { label, name, phone, address, city, state, pinCode, landmark, isDefault } = req.body;
    if (!name || !phone || !address || !city || !pinCode) {
      const error = new Error("All required address fields must be filled");
      error.statusCode = 400;
      return next(error);
    }

    if (isDefault) {
      await Address.updateMany({ userId: req.user._id }, { isDefault: false });
    }

    const newAddress = await Address.create({
      userId: req.user._id,
      label: label || "Home",
      name,
      phone,
      address,
      city,
      state: state || "Madhya Pradesh",
      pinCode,
      landmark: landmark || "",
      isDefault: Boolean(isDefault),
    });

    res.status(201).json({ success: true, message: "Address saved", data: newAddress });
  } catch (error) {
    next(error);
  }
};

export const UpdateAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const { label, name, phone, address, city, state, pinCode, landmark, isDefault } = req.body;

    if (isDefault) {
      await Address.updateMany({ userId: req.user._id }, { isDefault: false });
    }

    const updated = await Address.findOneAndUpdate(
      { _id: addressId, userId: req.user._id },
      { label, name, phone, address, city, state, pinCode, landmark, isDefault },
      { new: true }
    );

    if (!updated) {
      const error = new Error("Address not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({ success: true, message: "Address updated", data: updated });
  } catch (error) {
    next(error);
  }
};

export const DeleteAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const deleted = await Address.findOneAndDelete({ _id: addressId, userId: req.user._id });
    if (!deleted) {
      const error = new Error("Address not found");
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({ success: true, message: "Address deleted" });
  } catch (error) {
    next(error);
  }
};

export const CreateReview = async (req, res, next) => {
  try {
    const { orderId, rating, comment, riderRating, riderComment } = req.body;
    if (!orderId || !rating) {
      const error = new Error("Order ID and rating are required");
      error.statusCode = 400;
      return next(error);
    }

    const order = await Order.findById(orderId);
    if (!order) {
      const error = new Error("Order not found");
      error.statusCode = 404;
      return next(error);
    }

    const review = await Review.create({
      customerId: req.user._id,
      restaurantId: order.restaurantId,
      orderId,
      rating: Number(rating),
      comment: comment || "",
      riderRating: riderRating ? Number(riderRating) : undefined,
      riderComment: riderComment || "",
    });

    // Also update rating on order
    order.rating = Number(rating);
    if (comment) order.review = comment;
    await order.save();

    res.status(201).json({ success: true, message: "Review submitted successfully", data: review });
  } catch (error) {
    next(error);
  }
};

export const CreateComplaint = async (req, res, next) => {
  try {
    const { orderId, subject, description, category } = req.body;
    if (!subject || !description) {
      const error = new Error("Subject and description are required");
      error.statusCode = 400;
      return next(error);
    }

    const ticketNumber = `TKT-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const complaint = await Complaint.create({
      ticketNumber,
      userId: req.user._id,
      userRole: "customer",
      orderId: orderId || null,
      subject,
      description,
      category: category || "other",
      status: "open",
    });

    res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};

export const GetMyComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({ userId: req.user._id })
      .populate("orderId", "orderStatus billDetails")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: complaints });
  } catch (error) {
    next(error);
  }
};

export const GetNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30);

    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    next(error);
  }
};
