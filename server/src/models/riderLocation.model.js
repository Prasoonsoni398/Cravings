import mongoose from "mongoose";

const RiderLocationSchema = new mongoose.Schema(
  {
    riderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "rider",
      required: true,
      index: true,
    },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    heading: { type: Number, default: 0 },
    speed: { type: Number, default: 0 },
    currentOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
      default: null,
    },
    batteryLevel: { type: Number, default: 100 },
  },
  { timestamps: true }
);

const RiderLocation = mongoose.model("RiderLocation", RiderLocationSchema);

export default RiderLocation;
