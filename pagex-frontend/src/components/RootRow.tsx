"use client";

import { FolderOpen } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";

interface Props {
  isActive: boolean;
  onClick: () => void;
}

export default function RootRow({ isActive, onClick }: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id: "root", // 👈 IMPORTANT
  });

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer text-sm
        ${isActive ? "bg-muted font-medium" : "hover:bg-muted"}
        ${isOver ? "bg-border ring-1 ring-muted-foreground/30" : ""}
      `}
    >
      <FolderOpen className="h-4 w-4 text-muted-foreground" />
      <span>All Files</span>
    </div>
  );
}
