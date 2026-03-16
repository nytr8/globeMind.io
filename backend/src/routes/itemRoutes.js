import { Router } from "express";
import { createItem } from "../controllers/itemController.js";
import { authUser } from "../middlewares/authMiddleware.js";

const itemRouter = Router();

itemRouter.post("/createitem", authUser, createItem);

export default itemRouter;
