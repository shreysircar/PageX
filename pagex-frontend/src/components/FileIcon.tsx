"use client";

import {
  FileText,
  Image as ImageIcon,
  Music,
  Video,
  Archive,
  File,
} from "lucide-react";

export default function FileIcon({ mimetype }: { mimetype?: string }) {
  const type = mimetype ?? "";

  if (type.includes("pdf")) return <FileText className="h-5 w-5" />;
  if (type.startsWith("image/")) return <ImageIcon className="h-5 w-5" />;
  if (type.startsWith("audio/")) return <Music className="h-5 w-5" />;
  if (type.startsWith("video/")) return <Video className="h-5 w-5" />;
  if (type.includes("zip")) return <Archive className="h-5 w-5" />;

  return <File className="h-5 w-5" />;
}
