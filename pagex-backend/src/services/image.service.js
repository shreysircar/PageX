import sharp from "sharp";
import Tesseract from "tesseract.js";
import path from "path";

export const processImage = async (file) => {
  const thumbnailPath = file.path.replace(
    path.extname(file.path),
    "-thumb.png"
  );

  // Thumbnail
  await sharp(file.path)
    .resize(300)
    .png()
    .toFile(thumbnailPath);

  // OCR
  const {
    data: { text },
  } = await Tesseract.recognize(file.path, "eng");

  return {
    extractedText: text,
    thumbnailPath,
  };
};
