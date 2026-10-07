import http from "http";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import cloudinary from "./src/config/cloudinary.config.js";
import connectDB from "./src/config/dbconnection.config.js";
import { initSocket } from "./src/config/socket.config.js";

import AuthRouter from "./src/router/auth.route.js";
import PublicRouter from "./src/router/public.route.js";
import UserRouter from "./src/router/common.route.js";
import OrderRouter from "./src/router/order.route.js";
import PaymentRouter from "./src/router/payment.route.js";
import RestaurantRouter from "./src/router/restaurant.route.js";
import CustomerRouter from "./src/router/customer.route.js";
import RiderRouter from "./src/router/rider.route.js";
import AdminRouter from "./src/router/admin.route.js";

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with HTTP server
initSocket(server);

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// Application Routers
app.use("/auth", AuthRouter);
app.use("/public", PublicRouter);
app.use("/common", UserRouter);
app.use("/orders", OrderRouter);
app.use("/payments", PaymentRouter);
app.use("/restaurant", RestaurantRouter);
app.use("/admin", AdminRouter);
app.use("/customer", CustomerRouter);
app.use("/rider", RiderRouter);

// Default API
app.get("/", (req, res) => {
  res.json({ message: "Cravings API Server Running Successfully" });
});

// Default error handler
app.use((err, req, res, next) => {
  const ErrMessage = err.message || "Internal Server Error";
  const ErrStatusCode = err.statusCode || 500;
  res.status(ErrStatusCode).json({ message: ErrMessage });
});

const port = process.env.PORT || 4500;
server.listen(port, async () => {
  console.log(`Server started on PORT ${port}`);
  await connectDB();

  try {
    const result = await cloudinary.api.ping();
    console.log("Cloudinary connected:", result.status || "OK");
  } catch (error) {
    console.warn("Cloudinary connection warning:", error.message);
  }
});

export { app, server };
