import express from "express";
import {
  register,
  login,
  getUser,
  logOut,
} from "../controllers/authController.js";
import { authUser } from "../middlewares/authMiddleware.js";
import {
  registerValidation,
  loginValidation,
} from "../validation/authValidation.js";

const authRoutes = express.Router();

authRoutes.post("/register", registerValidation, register);
authRoutes.get("/login", loginValidation, login);
authRoutes.get("/get-me", authUser, getUser);
authRoutes.get("/logout", authUser, logOut);

export default authRoutes;
