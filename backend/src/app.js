import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import itemRouter from "./routes/itemRoutes.js";
import cors from "cors";
import graphRouter from "./routes/graphRoutes.js";
import path from "path";
const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.static("/public"));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// Cookie parser middleware
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", itemRouter);
app.use("/api/graph", graphRouter);
app.use("*name", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "/public/index.html"));
});

export default app;
