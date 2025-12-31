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
import { generateEmbedding } from "../utils/embeddings.js";



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
    try {
      const file = req.file;
      let embeddingVector = null;
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

      // Generate embedding ONLY if text exists
      if (processedData.extractedText) {
        embeddingVector = await generateEmbedding(processedData.extractedText);
      }

      // 1️⃣ Create File (NO embedding here)
      const savedFile = await prisma.file.create({
        data: {
          filename: file.filename,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          path: file.path,
          userId: req.user.id,
          extractedText: processedData.extractedText || null,
          thumbnailPath: processedData.thumbnailPath || null,
          duration: processedData.duration || null,
        },
      });

      // 2️⃣ Store embedding separately
      if (embeddingVector?.length) {
        await prisma.embedding.create({
          data: {
            vector: embeddingVector,
            fileId: savedFile.id,
          },
        });
      }

      res.status(201).json({
        message: "File uploaded & processed",
        file: savedFile,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Upload failed" });
    }
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
