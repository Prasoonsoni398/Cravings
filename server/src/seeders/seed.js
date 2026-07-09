import dotenv from "dotenv";
dotenv.config();
import connectDB from "../config/dbconnection.config.js";
import adminSeed from "./admin.seed.js";
import userSeed from "./user.seed.js";

const Seed = async () => {
  try {
    connectDB();

    // CAll the function which we need to seed
    await adminSeed();
    await userSedd()


  } catch (error) {
    console.log(error.message);
  } finally {
    process.exit(1);
  }
};

Seed();
