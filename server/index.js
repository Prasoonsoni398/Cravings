import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./src/config/dbconnection.config.js";
import AuthRouter from "./src/router/auth.route.js";
import PublicRouter from "./src/router/public.route.js";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import UserRouter from "./src/router/user.route.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());


app.use("/auth", AuthRouter);
app.use("/public", PublicRouter);
app.use("/user", UserRouter);

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
app.listen(port, () => {
  console.log("Server Started on PORT", port);
  connectDB();
});
