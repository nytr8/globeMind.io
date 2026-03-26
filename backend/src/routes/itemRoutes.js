import { Router } from "express";
import {
  createItem,
  getAllitems,
  getItem,
} from "../controllers/itemController.js";
import { authUser } from "../middlewares/authMiddleware.js";

const itemRouter = Router();

itemRouter.post("/createitem", authUser, createItem);
itemRouter.get("/getallitems", authUser, getAllitems);
itemRouter.get("/getitem/:itemId", authUser, getItem);
itemRouter.delete("/delete/:itemId", authUser, getItem);

export default itemRouter;
