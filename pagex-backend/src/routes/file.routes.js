import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import prisma from "../utils/prisma.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getFileCategory } from "../services/fileType.service.js";
import { processImage } from "../services/image.service.js";
import { processDocument } from "../services/document.service.js";
import { processVideo } from "../services/video.service.js";


const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userDir = `src/uploads/${req.user.id}`;
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// UPLOAD FILE
router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    const file = req.file;

    let processedData = {};

    const category = getFileCategory(file);

    if (category === "image") {
      processedData = await processImage(file);
    }

    if (category === "document") {
      processedData = await processDocument(file);
    }

    if (category === "video") {
      processedData = await processVideo(file);
    }

    const savedFile = await prisma.file.create({
      data: {
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path,
        userId: req.user.id,
        ...processedData,
      },
    });

    res.status(201).json({
      message: "File uploaded & processed",
      file: savedFile,
    });
  }
);

// LIST FILES
router.get("/", authMiddleware, async (req, res) => {
  const files = await prisma.file.findMany({
    where: { userId: req.user.id },
  });

  res.json(files);
});

export default router;
