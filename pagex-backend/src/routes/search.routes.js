import express from "express";
import prisma from "../utils/prisma.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { generateEmbedding } from "../utils/embeddings.js";
import { cosineSimilarity } from "../utils/similarity.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({ message: "Search query required" });
    }

    /* =====================================================
       1️⃣ FILENAME-FIRST SEARCH (USER INTENT: FILE RECALL)
    ===================================================== */
    const filenameResults = await prisma.file.findMany({
      where: {
        userId: req.user.id,
        deletedAt: null,
        originalName: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        originalName: true,
      },
    });

    if (filenameResults.length > 0) {
      return res.json({
        type: "filename",
        results: filenameResults,
      });
    }

    /* =====================================================
       2️⃣ SEMANTIC SEARCH (USER INTENT: CONTENT DISCOVERY)
    ===================================================== */
    const queryEmbedding = await generateEmbedding(query);

    const files = await prisma.file.findMany({
      where: {
        userId: req.user.id,
        deletedAt: null,
        embeddings: {
          some: {},
        },
      },
      include: {
        embeddings: true,
      },
    });

    const semanticResults = files
      .map((file) => {
        let bestScore = -1;

        for (const emb of file.embeddings) {
          const score = cosineSimilarity(queryEmbedding, emb.vector);
          if (score > bestScore) bestScore = score;
        }

        // semantic threshold (tuned)
        if (bestScore < 0.35) return null;

        return {
          id: file.id,
          originalName: file.originalName,
          score: Number(bestScore.toFixed(3)),
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score);

    if (semanticResults.length > 0) {
      return res.json({
        type: "semantic",
        message: "Showing results by content",
        results: semanticResults,
      });
    }

    /* =====================================================
       3️⃣ KEYWORD FALLBACK (LAST RESORT)
    ===================================================== */
    const keywordResults = await prisma.file.findMany({
      where: {
        userId: req.user.id,
        deletedAt: null,
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
      message: "Showing results by keyword match",
      results: keywordResults,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Search failed" });
  }
});

export default router;
