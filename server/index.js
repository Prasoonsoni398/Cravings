
import cloudinary from "./src/config/cloudinary.config.js";
import express from "express";
import connectDB from "./src/config/dbconnection.config.js";
import AuthRouter from "./src/router/auth.route.js";
import PublicRouter from "./src/router/public.route.js";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import UserRouter from "./src/router/common.route.js";
import OrderRouter from "./src/router/order.route.js";

import RestaurantRouter from "./src/router/restaurant.route.js";
import CustomerRouter from "./src/router/customer.route.js";
import RiderRouter from "./src/router/rider.route.js";
import AdminRouter from "./src/router/admin.route.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());


app.use("/auth", AuthRouter);
app.use("/public", PublicRouter);
app.use("/common", UserRouter);
app.use("/orders", OrderRouter);


app.use("/restaurant", RestaurantRouter);
app.use("/admin", AdminRouter);
app.use("/customer", CustomerRouter);
app.use("/rider", RiderRouter);


// Default API
app.get("/", (req, res) => {
  console.log("Default Get API Hit");
  res.json({ message: "Welcome to my first backend Project" });
});

// Default error handler
app.use((err, req, res, next) => {
  const ErrMessage = err.message || "Internal Sever Error";
  const ErrStatusCode = err.statusCode || 500;

  res.status(ErrStatusCode).json({ message: ErrMessage });
});

const port = process.env.PORT || 5000;
app.listen(port, async () =>  {
  console.log("Server Started on PORT", port);
  connectDB();

  try {
    const result = await cloudinary.api.ping();
    console.log("Cloudinary connected:");
    console.log(result);  
    
    
  } catch (error) {
    console.log(error.message);
    process.exit(1)
    
  }
});
