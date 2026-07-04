import express from "express";
import {
  LoginUser,
  LogoutUser,
  RegisterUser,
} from "../controller/auth.controller.js";
import { EditUserProfile } from "../controller/user.controller.js";
import { AuthProtect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", RegisterUser);
router.post("/login", LoginUser);
router.get("/logout", LogoutUser);
router.put("/profile", AuthProtect, EditUserProfile);


export default router;