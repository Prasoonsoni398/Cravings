import User from "../models/user.model.js";
import bcrypt from "bcrypt";

const adminSeed = async () => {
  try {
    // Hash password first
    const hashedPassword = await bcrypt.hash("StrongPassword@123", 10);

    const AdminUser = {
      fullName: "Admin",
      email: "example@gmail.com",
      password: hashedPassword,
      dob: "2004-01-19",
      gender: "male",
      userType: "admin",
      phone: "8827580454",
      photo: {
        url: "https://placehold.co/600x400?text=A",
        publicId: "default_admin_photo",
      },
    };

    const existingAdmin = await User.findOne({ email: AdminUser.email });

    if (existingAdmin) {
      console.log("Existing Admin Found");
      console.log("Deleting Existing Admin...");
      await existingAdmin.deleteOne();
    }

    console.log("Creating New Admin...");

    const newAdmin = await User.create(AdminUser);

    console.log("Admin Created Successfully");
    console.log(newAdmin);
  } catch (error) {
    console.error("Admin not created");
    console.error(error);
  }
};

export default adminSeed;