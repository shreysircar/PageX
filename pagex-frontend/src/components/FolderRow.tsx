"use client";

import { Folder, Trash2 } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";

interface FolderRowProps {
  folder: {
    id: string;
    name: string;
  };
  isActive: boolean;
  onClick: () => void;
  onDelete?: (folderId: string) => void; // ✅ NEW
}

export default function FolderRow({
  folder,
  isActive,
  onClick,
  onDelete,
}: FolderRowProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: folder.id, // 👈 IMPORTANT: drag target
  });

  return (
    <div
      ref={setNodeRef}
      className={`group flex items-center justify-between px-3 py-2 rounded-md cursor-pointer text-sm
        ${isActive ? "bg-muted font-medium" : "hover:bg-muted"}
        ${isOver ? "bg-border ring-1 ring-muted-foreground/30" : ""}
      `}
    >
      {/* Left: folder icon + name (navigation) */}
      <div
        onClick={onClick}
        className="flex items-center gap-2 truncate"
      >
        <Folder className="h-4 w-4 text-muted-foreground" />
        <span className="truncate">{folder.name}</span>
      </div>

      {/* Right: delete (root only, hover) */}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // 🚨 CRITICAL: don’t open folder
            onDelete(folder.id);
          }}
          className="opacity-0 group-hover:opacity-100 transition text-muted hover:text-danger"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
