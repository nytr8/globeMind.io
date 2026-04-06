import { Router } from "express";
import {
  addItemToCollection,
  createCollection,
  deleteCollection,
  getCollectionById,
  getCollections,
  removeItemFromCollection,
  updateCollection,
} from "../controllers/collectionController.js";
import { authUser } from "../middlewares/authMiddleware.js";

const collectionRouter = Router();

collectionRouter.post("/", authUser, createCollection);
collectionRouter.get("/", authUser, getCollections);
collectionRouter.get("/:collectionId", authUser, getCollectionById);
collectionRouter.patch("/:collectionId", authUser, updateCollection);
collectionRouter.delete("/:collectionId", authUser, deleteCollection);
collectionRouter.post(
  "/:collectionId/items/:itemId",
  authUser,
  addItemToCollection,
);
collectionRouter.delete(
  "/:collectionId/items/:itemId",
  authUser,
  removeItemFromCollection,
);

export default collectionRouter;
