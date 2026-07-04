import User from "../models/user.model.js";

export const EditUserProfile = async (req, res, next) => {
  try {
    const { email, fullName, phone } = req.body;
    const currentUserId = req.user?._id || req.body.userId;

    if (!fullName || !phone) {
      const error = new Error("All fields Required");
      error.statusCode = 400;
      return next(error);
    }

    const existingUser = await User.findById(currentUserId);
    if (!existingUser) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    if (email && existingUser.email !== email) {
      const error = new Error("You can only update your own profile");
      error.statusCode = 403;
      return next(error);
    }

    existingUser.fullName = fullName.trim();
    existingUser.phone = phone.trim();

    await existingUser.save();

    res.status(200).json({
      message: "User Updated Sucessfully",
      data: existingUser,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};