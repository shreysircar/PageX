import fs from "fs";
import prisma from "./prisma.js";

const TRASH_DAYS = 30;

export async function cleanupTrashedFiles() {
  const cutoff = new Date(
    Date.now() - TRASH_DAYS * 24 * 60 * 60 * 1000
  );

  const oldFiles = await prisma.file.findMany({
    where: {
      deletedAt: {
        lt: cutoff,
      },
    },
  });

  for (const file of oldFiles) {
    try {
      // delete disk file
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      // delete embedding
      await prisma.embedding.deleteMany({
        where: { fileId: file.id },
      });

      // delete file record
      await prisma.file.delete({
        where: { id: file.id },
      });

      console.log(`🗑️ Auto-deleted file: ${file.originalName}`);
    } catch (err) {
      console.error("Cleanup failed for:", file.id, err);
    }
  }
}
