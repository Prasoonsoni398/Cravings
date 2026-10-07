import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/order.model.js";
import { emitToRestaurant, emitToAdmin, emitToOrder } from "../config/socket.config.js";

const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay environment variables are not configured");
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

export const GetRazorpayKey = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      keyId: process.env.RAZORPAY_KEY_ID || "",
    });
  } catch (error) {
    next(error);
  }
};

export const CreateRazorpayOrder = async (req, res, next) => {
  try {
    const { amount, receipt } = req.body;

    if (!amount || amount <= 0) {
      const error = new Error("Invalid payment amount");
      error.statusCode = 400;
      return next(error);
    }

    const razorpay = getRazorpayInstance();
    const options = {
      amount: Math.round(Number(amount) * 100), // in paise
      currency: "INR",
      receipt: receipt || `rcpt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      data: razorpayOrder,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    next(error);
  }
};

export const VerifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      const error = new Error("Incomplete payment verification payload");
      error.statusCode = 400;
      return next(error);
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      if (orderId) {
        await Order.findByIdAndUpdate(orderId, {
          "paymentDetails.paymentStatus": "failed",
        });
      }
      const error = new Error("Payment signature verification failed");
      error.statusCode = 400;
      return next(error);
    }

    let updatedOrder = null;
    if (orderId) {
      updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        {
          "paymentDetails.paymentStatus": "completed",
          "paymentDetails.razorpayOrderId": razorpay_order_id,
          "paymentDetails.razorpayPaymentId": razorpay_payment_id,
          "paymentDetails.razorpaySignature": razorpay_signature,
          $push: {
            timeline: {
              status: "placed",
              note: `Payment verified via Razorpay ID: ${razorpay_payment_id}`,
              timestamp: new Date(),
            },
          },
        },
        { new: true }
      ).populate("restaurantId", "name address phone");

      if (updatedOrder) {
        emitToRestaurant(updatedOrder.restaurantId?._id?.toString(), "order:created", updatedOrder);
        emitToAdmin("order:created", updatedOrder);
        emitToOrder(updatedOrder._id.toString(), "order:status_updated", updatedOrder);
      }
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    next(error);
  }
};
