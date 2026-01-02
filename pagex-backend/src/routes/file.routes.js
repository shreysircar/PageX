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


// LIST FILES (exclude trash)
router.get("/", authMiddleware, async (req, res) => {
  const files = await prisma.file.findMany({
    where: {
      userId: req.user.id,
      deletedAt: null, // 👈 KEY LINE
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(files);
});

// LIST TRASH
router.get("/trash", authMiddleware, async (req, res) => {
  const files = await prisma.file.findMany({
    where: {
      userId: req.user.id,
      deletedAt: { not: null },
    },
    orderBy: { deletedAt: "desc" },
  });

  res.json(files);
});


// MOVE TO TRASH (soft delete)
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  const file = await prisma.file.findFirst({
    where: { id, userId: req.user.id, deletedAt: null },
  });

  if (!file) {
    return res.status(404).json({ message: "File not found" });
  }

  await prisma.file.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  res.json({ message: "File moved to trash" });
});

// RESTORE FILE FROM TRASH
router.post("/:id/restore", authMiddleware, async (req, res) => {
  const file = await prisma.file.findFirst({
    where: {
      id: req.params.id,
      userId: req.user.id,
      deletedAt: { not: null },
    },
  });

  if (!file) {
    return res.status(404).json({ message: "File not found in trash" });
  }

  await prisma.file.update({
    where: { id: file.id },
    data: { deletedAt: null },
  });

  res.json({ message: "File restored successfully" });
});


// DELETE FOREVER
router.delete("/:id/force", authMiddleware, async (req, res) => {
  const file = await prisma.file.findFirst({
    where: { id: req.params.id, userId: req.user.id },
  });

  if (!file) {
    return res.status(404).json({ message: "File not found" });
  }

  // delete disk file
  if (file.path && fs.existsSync(file.path)) {
    fs.unlinkSync(file.path);
  }

  // delete embedding
  await prisma.embedding.deleteMany({
    where: { fileId: file.id },
  });

  // delete DB record
  await prisma.file.delete({ where: { id: file.id } });

  res.json({ message: "File permanently deleted" });
});


export default router;
