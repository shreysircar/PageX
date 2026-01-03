import express from "express";
import multer from "multer";
import fs from "fs";
import prisma from "../utils/prisma.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getFileCategory } from "../services/fileType.service.js";
import { processImage } from "../services/image.service.js";
import { processDocument } from "../services/document.service.js";
import { processVideo } from "../services/video.service.js";
import { generateEmbedding } from "../utils/embeddings.js";

const router = express.Router();

/* =========================
   TEXT CHUNKING HELPER
========================= */
function chunkText(text, chunkSize = 500, overlap = 100) {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    chunks.push(text.slice(start, start + chunkSize));
    start += chunkSize - overlap;
  }

  return chunks;
}

/* =========================
   MULTER STORAGE
========================= */
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

/* =========================
   UPLOAD FILE
========================= */
router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    try {
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

      // 1️⃣ Save file metadata (NO embeddings here)
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

      // 2️⃣ Generate & store CHUNKED embeddings
      if (processedData.extractedText) {
        const chunks = chunkText(processedData.extractedText);

        const vectors = await Promise.all(
          chunks.map((chunk) => generateEmbedding(chunk))
        );

        await prisma.embedding.createMany({
          data: vectors.map((vector) => ({
            vector,
            fileId: savedFile.id,
          })),
        });
      }

      res.status(201).json({
        message: "File uploaded, processed & indexed",
        file: savedFile,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

/* =========================
   LIST FILES (NON-TRASH)
========================= */
router.get("/", authMiddleware, async (req, res) => {
  const files = await prisma.file.findMany({
    where: {
      userId: req.user.id,
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(files);
});


/* =========================
   LIST TRASH
========================= */
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


// DOWNLOAD FILE
router.get("/:id/download", authMiddleware, async (req, res) => {
  const { id } = req.params;

  const file = await prisma.file.findFirst({
    where: {
      id,
      userId: req.user.id,
      deletedAt: null,
    },
  });

  if (!file) {
    return res.status(404).json({ message: "File not found" });
  }

  if (!fs.existsSync(file.path)) {
    return res.status(404).json({ message: "File missing on disk" });
  }

  res.download(file.path, file.originalName);
});



/* =========================
   MOVE TO TRASH
========================= */
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

/* =========================
   RESTORE FROM TRASH
========================= */
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

/* =========================
   DELETE FOREVER
========================= */
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

  // delete embeddings
  await prisma.embedding.deleteMany({
    where: { fileId: file.id },
  });

  // delete file record
  await prisma.file.delete({
    where: { id: file.id },
  });

  res.json({ message: "File permanently deleted" });
});

export default router;
