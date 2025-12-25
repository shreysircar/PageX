import mime from "mime-types";

export const getFileCategory = (file) => {
  const type = mime.lookup(file.originalname);

  if (!type) return "unknown";

  if (type.startsWith("image")) return "image";
  if (type.startsWith("video")) return "video";
  if (type.startsWith("text") || type.includes("pdf")) return "document";

  return "unknown";
};
