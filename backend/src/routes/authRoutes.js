import express from "express";
import { register, login, getUser } from "../controllers/authController.js";
import { authUser } from "../middlewares/authMiddleware.js";

const authRoutes = express.Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.get("/user", authUser, getUser);

export default authRoutes;
