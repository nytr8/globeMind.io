import express from "express";
import { register, login, getUser } from "../controllers/authController.js";
import { authUser } from "../middlewares/authMiddleware.js";
import {
  registerValidation,
  loginValidation,
} from "../validation/authValidation.js";

const authRoutes = express.Router();

authRoutes.post("/register", registerValidation, register);
authRoutes.post("/login", loginValidation, login);
authRoutes.get("/get-me", authUser, getUser);

export default authRoutes;
