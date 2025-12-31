import express from "express";
import prisma from "../utils/prisma.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { generateEmbedding } from "../utils/embeddings.js";
import { cosineSimilarity } from "../utils/similarity.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ message: "Search query required" });
    }

    // 1️⃣ Generate query embedding
    const queryEmbedding = await generateEmbedding(query);

    // 2️⃣ Fetch ONLY files that have embeddings
    const files = await prisma.file.findMany({
      where: {
        userId: req.user.id,
        embeddings: {
          some: {}, // ✅ KEY FIX
        },
      },
      include: {
        embeddings: true, // ✅ load vectors
      },
    });

    // 3️⃣ Rank by cosine similarity
    const ranked = files
      .map((file) => {
        const vector = file.embeddings[0]?.vector;
        if (!vector) return null;

        return {
          id: file.id,
          originalName: file.originalName,
          score: cosineSimilarity(queryEmbedding, vector),
        };
      })
      .filter((f) => f && f.score > 0.2)
      .sort((a, b) => b.score - a.score);

    // 4️⃣ Keyword fallback
    if (ranked.length === 0) {
      const keywordResults = await prisma.file.findMany({
        where: {
          userId: req.user.id,
          OR: [
            { originalName: { contains: query, mode: "insensitive" } },
            { extractedText: { contains: query, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          originalName: true,
        },
      });

      return res.json({
        type: "keyword",
        results: keywordResults,
      });
    }

    res.json({
      type: "semantic",
      results: ranked,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Search failed" });
  }
});

export default router;
