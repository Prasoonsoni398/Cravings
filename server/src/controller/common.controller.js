import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.config.js";
import bcrypt from "bcrypt"

const uploadPhotoToCloudinary = async (file) => {
  if (!file) return null;

  const base64 = Buffer.from(file.buffer).toString("base64");
  const dataURI = `data:${file.mimetype};base64,${base64}`;

  const result = await cloudinary.uploader.upload(dataURI, {
    folder: "cravings/users",
    resource_type: "image",
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
};

export const EditUserProfile = async (req, res, next) => {

  try {
    const { email, fullName, phone } = req.body;
    const currentUserId = req.user?._id || req.body.userId;
    const newPhoto = req.file;

    if (!fullName && !phone && !email && !newPhoto) {
      const error = new Error("Please provide at least one field to update");
      error.statusCode = 400;
      return next(error);
    }

    const existingUser = await User.findById(currentUserId);
    if (!existingUser) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    if (email?.trim()) {
      const normalizedEmail = email.trim().toLowerCase();
      if (normalizedEmail !== existingUser.email.toLowerCase()) {
        const emailExists = await User.findOne({
          email: normalizedEmail,
          _id: { $ne: currentUserId },
        });

        if (emailExists) {
          const error = new Error("Email already registered");
          error.statusCode = 409;
          return next(error);
        }
      }

      existingUser.email = normalizedEmail;
    }

    if (newPhoto) {
      existingUser.photo?.publicId &&
        (await cloudinary.uploader
          .destroy(existingUser.photo.publicId)
          .catch(() => {}));

      existingUser.photo = await uploadPhotoToCloudinary(newPhoto);
    }

    if (fullName?.trim()) {
      existingUser.fullName = fullName.trim();
    }

    if (phone?.trim()) {
      existingUser.phone = phone.trim();
    }

    await existingUser.save();

    res.status(200).json({
      message: "User Updated Successfully",
      data: existingUser,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
export const UpdateUserPassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      const error = new Error("All fields Required");
      error.statusCode = 400;
      return next(error);
    }

    // User Already Verified By Auth Protect Middleware
    // const existingUser = await User.findOne({ email });
    // if (!existingUser) {
    //   const error = new Error("Email not registred");
    //   error.statusCode = 404;
    //   return next(error);
    // }

    // we can use req.user to get the current user since the user is already verified by the auth protect middleware
    const currentUser = req.user;

    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      currentUser.password,
    );
    if (!isPasswordMatch) {
      const error = new Error("Old password is incorrect");
      error.statusCode = 400;
      return next(error);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    currentUser.password = hashedPassword;
    await currentUser.save();

    // Delay for 3 seconds before sending the response
    await new Promise((resolve) => setTimeout(resolve, 3000));

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error.message);
    next();
  }
};