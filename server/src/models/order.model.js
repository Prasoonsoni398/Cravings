import mongoose from "mongoose";

const OrderSchema = mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "restaurant",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    riderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "rider",
      required: false,
    },
    orderItems: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "menu",
          required: false,
        },
        name: { type: String },
        price: { type: Number },
        quantity: { type: Number, required: true },
        image: { type: String },
      },
    ],
    orderStatus: {
      type: String,
      enum: [
        "placed",
        "pending",
        "restaurant_accepted",
        "accepted",
        "preparing",
        "ready_for_pickup",
        "ready",
        "rider_assigned",
        "rider_arrived",
        "picked_up",
        "pickedUp",
        "onTheWay",
        "out_for_delivery",
        "outForDelivery",
        "undeliverable",
        "delivered",
        "cancelled",
        "failed",
        "rejected",
      ],
      default: "placed",
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
    },
    billDetails: {
      totalAmount: { type: Number, required: true },
      platformFee: { type: Number, default: 0 },
      convenienceFee: { type: Number, default: 0 },
      taxAmount: { type: Number, default: 0 },
      deliveryCharge: { type: Number, default: 0 },
      discountAmount: { type: Number, default: 0 },
      finalAmount: { type: Number, required: true },
    },
    deliveryAddress: {
      name: { type: String, required: true },
      phone: { type: String },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String },
      pinCode: { type: String, required: true },
      country: { type: String, default: "India" },
      geoLocation: {
        lat: { type: String },
        lon: { type: String },
      },
    },
    paymentDetails: {
      paymentMethod: {
        type: String,
        enum: ["card", "upi", "cod", "netbanking", "wallet"],
        required: true,
      },
      paymentStatus: {
        type: String,
        enum: ["pending", "completed", "failed", "refunded"],
        default: "pending",
      },
      razorpayOrderId: { type: String },
      razorpayPaymentId: { type: String },
      razorpaySignature: { type: String },
    },
    timeline: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        note: { type: String },
      },
    ],
    cancellationReason: {
      type: String,
    },
    estimatedDeliveryTime: {
      type: Date,
    },
    specialInstructions: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model("order", OrderSchema);

export default Order;
