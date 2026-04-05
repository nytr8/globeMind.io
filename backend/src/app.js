import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import itemRouter from "./routes/itemRoutes.js";
import cors from "cors";
import graphRouter from "./routes/graphRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import path from "path";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../public")));

// Body parser middleware
app.use(express.json());
app.use(
  cors({
    origin: "https://globemind-io.onrender.com",
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
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

export default app;
