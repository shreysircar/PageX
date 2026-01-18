import express from "express";
import prisma from "../utils/prisma.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * POST /folders
 * Create a new folder
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Folder name is required" });
    }

    const existing = await prisma.folder.findFirst({
      where: {
        userId,
        name: name.trim(),
      },
    });

    if (existing) {
      return res
        .status(409)
        .json({ message: "Folder with this name already exists" });
    }

    const folder = await prisma.folder.create({
      data: {
        name: name.trim(),
        userId,
      },
    });

    res.status(201).json(folder);
  } catch (error) {
    console.error("Create folder error:", error);
    res.status(500).json({ message: "Failed to create folder" });
  }
});


/**
 * GET /folders
 * List all folders for the logged-in user
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const folders = await prisma.folder.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });

    res.json(folders);
  } catch (error) {
    console.error("List folders error:", error);
    res.status(200).json(folders);
  }
});

/**
 * DELETE /folders/:id
 * Delete a folder and move files to root
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const folderId = req.params.id;

    // Ensure folder belongs to user
    const folder = await prisma.folder.findFirst({
      where: { id: folderId, userId },
    });

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    // Move files to root (folderId = null)
await prisma.file.updateMany({
  where: {
    folderId,
    userId,
  },
  data: { folderId: null },
});


    // Delete folder
    await prisma.folder.delete({
      where: { id: folderId },
    });

    res.json({ message: "Folder deleted" });
  } catch (error) {
    console.error("Delete folder error:", error);
    res.status(500).json({ message: "Failed to delete folder" });
  }
});

export default router;
