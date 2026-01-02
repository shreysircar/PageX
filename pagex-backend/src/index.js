import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import { authMiddleware } from "./middleware/auth.middleware.js";
import fileRoutes from "./routes/file.routes.js";
import searchRoutes from "./routes/search.routes.js";
import { cleanupTrashedFiles } from "./utils/trashCleanup.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/files", fileRoutes);
app.use("/search", searchRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("PageX Backend is running");
});

// Routes
app.use("/auth", authRoutes);

// Protected test route
app.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Welcome to PageX protected route",
    user: req.user,
  });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 PageX backend running on port ${PORT}`);

  // 🧹 Run cleanup once on startup
  cleanupTrashedFiles();

  // 🕒 Run cleanup every 24 hours
  setInterval(() => {
    cleanupTrashedFiles();
  }, 24 * 60 * 60 * 1000);
});
