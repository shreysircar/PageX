import fs from "fs";

export const processDocument = async (file) => {
  const text = fs.readFileSync(file.path, "utf-8");

  return {
    extractedText: text,
  };
};
