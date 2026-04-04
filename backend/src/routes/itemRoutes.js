import { Router } from "express";
import {
  createItem,
  deleteItem,
  getAllitems,
  getItem,
  getResurfacedItems,
  searchItems,
} from "../controllers/itemController.js";
import { authUser } from "../middlewares/authMiddleware.js";

const itemRouter = Router();

itemRouter.post("/create", authUser, createItem);
itemRouter.get("/items", authUser, getAllitems);
itemRouter.get("/item/:itemId", authUser, getItem);
itemRouter.delete("/delete/:itemId", authUser, deleteItem);
itemRouter.get("/resurface", authUser, getResurfacedItems);
itemRouter.get("/search", authUser, searchItems);
// itemRouter.post("/reset", authUser, resetUserVectors);

export default itemRouter;
