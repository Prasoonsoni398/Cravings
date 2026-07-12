import express from "express";
import { EditUserProfile } from "../controller/common.controller.js";
import { AuthProtect } from "../middleware/auth.middleware.js";
import { UpdateUserPassword } from "../controller/common.controller.js"
import multer from "multer";

const Upload = multer(); // filter req.body and photos

const router = express.Router();

router.put(
  "/edit-profile",
  AuthProtect,
  Upload.single("displayPic"),
  EditUserProfile,
);

router.patch("/change-password", AuthProtect, UpdateUserPassword);


export default router;
