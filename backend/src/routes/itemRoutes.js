import { Router } from "express";
import {
  createItem,
  getAllitems,
  getItem,
} from "../controllers/itemController.js";
import { authUser } from "../middlewares/authMiddleware.js";

const itemRouter = Router();

itemRouter.post("/create", authUser, createItem);
itemRouter.get("/items", authUser, getAllitems);
itemRouter.get("/item/:itemId", authUser, getItem);
itemRouter.delete("/delete/:itemId", authUser, getItem);

export default itemRouter;
