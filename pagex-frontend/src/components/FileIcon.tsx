"use client";

import {
  FileText,
  Image as ImageIcon,
  Music,
  Video,
  Archive,
  File,
} from "lucide-react";

export default function FileIcon({ mimetype }: { mimetype: string }) {
  if (mimetype.includes("pdf")) return <FileText className="h-5 w-5" />;
  if (mimetype.startsWith("image/")) return <ImageIcon className="h-5 w-5" />;
  if (mimetype.startsWith("audio/")) return <Music className="h-5 w-5" />;
  if (mimetype.startsWith("video/")) return <Video className="h-5 w-5" />;
  if (mimetype.includes("zip")) return <Archive className="h-5 w-5" />;

  return <File className="h-5 w-5" />;
}
