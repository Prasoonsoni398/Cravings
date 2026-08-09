import mongoose from "mongoose";

const RestaurantSchema = mongoose.Schema(
  {
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    restaurantName: { type: String, required: true },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    pinCode: { type: String, default: "" },
    country: { type: String, default: "" },
    geoLocation: {
      type: {
        lat: {
          type: String,
        },
        lon: {
          type: String,
        },
      },
    },

    documents: {
      type: {
        legalName: { type: String, default: "" },
        companyType: { type: String, default: "" },
        gstCertificate: { type: String, default: "" },
        fssaiCertificate: { type: String, default: "" },
        panCard: { type: String, default: "" },
      },
      default: {},
    },
    financialDetails: {
      type: {
        bankName: { type: String, default: "" },
        accountNumber: { type: String, default: "" },
        ifscCode: { type: String, default: "" },
      },
      default: {},
    },
    contactDetails: {
      type: {
        email: { type: String, default: "" },
        phone: { type: String, default: "" },
      },
      default: {},
    },
    servingHours: {
      type: {
        openingTime: { type: String, required: true },
        closingTime: { type: String, required: true },
      },
    },
    isOpen: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "inactive",
    },
    averageRating: { type: Number, default: 0 },
    cuisineTypes: {
      type: [String],
      required: true,
    },
    restaurantImage: {
      type: [
        {
          url: { type: String, required: true },
          publicId: { type: String, required: true },
        },
      ],
    },
    coverImage: {
      type: {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    },
    description: { type: String, required: true },
    restaurantType: {
      type: String,
      enum: ["veg", "non-veg", "jain", "vegan", "both"],
      required: true,
    },
    socialMediaLinks: {
      type: [
        {
          platform: { type: String, required: true },
          url: { type: String, required: true },
        },
      ],
    },
  },
  { timestamps: true },
);

const Restaurant = mongoose.model("restaurant", RestaurantSchema);

export default Restaurant;
