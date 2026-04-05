import { Router } from "express";
import { authUser } from "../middlewares/authMiddleware.js";
import { getGraph } from "../controllers/relationcontroller.js";

const graphRouter = Router();

graphRouter.post("/getgraph", authUser, getGraph);

export default graphRouter;
