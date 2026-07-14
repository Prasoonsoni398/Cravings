import User from "../models/user.model.js";
import bcrypt from "bcrypt";

const UserData = [
    {
  fullName: "Manager",
  email: "manager@gmail.com",
  password: await bcrypt.hash("Manager1@123", 10),
  dob: "2004-01-19",
  gender: "male",
  userType: "restaurant",
  phone: "8827580454",
  photo: { url: "https://placehold.co/600x400?text=Admin", publicId: null },
},
    {
  fullName: "Customer",
  email: "customer@gmail.com",
  password: await bcrypt.hash("Customer1@123", 10),
  dob: "2004-01-19",
  gender: "male",
  userType: "customer",
  phone: "8827580454",
  photo: { url: "https://placehold.co/600x400?text=Admin", publicId: null },
},
    {
  fullName: "Rider",
  email: "rider@gmail.com",
  password: await bcrypt.hash("Rider1@123", 10),
  dob: "2004-01-19",
  gender: "male",
  userType: "rider",
  phone: "8827580454",
  photo: { url: "https://placehold.co/600x400?text=Admin", publicId: null },
},
]

const userSeed = async () => {
  try {

    // Seeding restaurant
    const existingRestraunt = await User.findOne({ email: UserData[0].email });

    if (existingRestraunt) {
      console.log("Existing Restaurant Found");
      console.log("Deleting Existing Restaurant");
      await existingRestraunt.deleteOne();
    }
    console.log("Creating new Admin");

    const newRestaurant = await User.create(UserData[0]);
    console.log("Restaurant Create Successfully");


    // Seeding customer
    const existingCustomer = await User.findOne({ email: UserData[1].email });

    if (existingCustomer) {
      console.log("Existing Customer Found");
      console.log("Deleting Existing Customer");
      await existingCustomer.deleteOne();
    }
    console.log("Creating new Admin");

    const newCustomer = await User.create(UserData[1]);
    console.log("Customer Create Successfully");


     // Seeding Rider
    const existingRider = await User.findOne({ email: UserData[1].email });

    if (existingRider) {
      console.log("Existing Rider Found");
      console.log("Deleting Existing Rider");
      await existingRider.deleteOne();
    }
    console.log("Creating new Admin");

    const newRider = await User.create(UserData[2]);
    console.log("Rider Create Successfully");


  } catch (error) {
    console.log("Rider not created");

    throw error;
  }
};

export default userSeed;
