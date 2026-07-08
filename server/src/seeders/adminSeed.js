import User from "../models/user.model.js";
import bcrypt from "bcrypt";

const AdminUser = {
  fullName: "Admin",
  email: "example@gmail.com",
  password: bcrypt.hash("StrongPassword@123", 10),
  dob: "2004-01-19",
  gender: "male",
  userType: "admin",
  phone: "8827580454",
  photo: { url: "https://placehold.co/600x400?text=A", publicId: null },
};

const adminSeed = async () => {
  try {
    const existingAdmin = await User.findOne({ email: AdminUser.email });

    if (existingAdmin) {
      console.log("Existing User Found");
      console.log("Deleting Existing User");
      await existingAdmin.deleteOne();
    }
    console.log("Creating new Admin");

    const newAdmin = await User.create(AdminUser);
    console.log("Admin Create Successfully");
  } catch (error) {
    console.log("Admin not created");

    throw error;
  }
};

export default adminSeed;
