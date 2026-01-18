"use client";

import {
  Eye,
  Trash2,
  RotateCcw,
  Download,
} from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import FileTypeIcon from "@/components/FileIcon";

interface Props {
  file: any;
  selected: boolean;
  onSelect: (id: string) => void;
  onPreview: (file: any) => void;
  onDelete: (fileId: string) => void;
  onForceDelete?: (fileId: string) => void;
  mode?: "default" | "trash";
}

export default function FileRow({
  file,
  selected,
  onSelect,
  onPreview,
  onDelete,
  onForceDelete,
  mode = "default",
}: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: file.id,
    });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
      }
    : undefined;

  const mimetype = file.mimetype ?? "unknown";

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`group border-b border-border hover:bg-border
        ${isDragging ? "opacity-50" : ""}
      `}
    >
      {/* Checkbox */}
      <td className="px-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(file.id)}
        />
      </td>

      {/* Name + Icon (DRAG HANDLE) */}
      <td className="px-4 py-3">
        <div
          className="flex items-center gap-3 cursor-grab"
          {...listeners}
          {...attributes}
        >
          <FileTypeIcon mimetype={mimetype} />
          <span className="truncate font-medium">
            {file.originalName ?? "Untitled"}
          </span>
        </div>
      </td>

      {/* Type */}
      <td className="px-4 py-3 text-muted">
        {mimetype === "unknown" ? "—" : mimetype}
      </td>

      {/* Duration */}
      <td className="px-4 py-3 text-muted">
        {file.duration ? `⏱ ${file.duration}s` : "—"}
      </td>

      {/* Actions */}
      <td className="px-4 py-3 text-right">
        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100">
          <button onClick={() => onPreview(file)}>
            <Eye className="h-4 w-4" />
          </button>

          {mode === "default" && (
            <button>
              <Download className="h-4 w-4" />
            </button>
          )}

          {mode === "trash" ? (
            <>
              <button onClick={() => onDelete(file.id)}>
                <RotateCcw className="h-4 w-4" />
              </button>
              <button onClick={() => onForceDelete?.(file.id)}>
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          ) : (
            <button onClick={() => onDelete(file.id)}>
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
