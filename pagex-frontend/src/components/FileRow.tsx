"use client";

import { Eye, Trash2, RotateCcw } from "lucide-react";

interface Props {
  file: any;
  selected: boolean;
  onSelect: (id: string) => void;
  onPreview: (file: any) => void;
  onDelete: (fileId: string) => void;
  onForceDelete?: (fileId: string) => void; // ✅ NEW
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
  return (
    <tr className="group border-b border-border hover:bg-border">
      <td className="px-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(file.id)}
        />
      </td>

      <td className="px-4 py-3 font-medium">
        {file.originalName}
      </td>

      <td className="px-4 py-3 text-muted">
        {file.mimetype}
      </td>

      <td className="px-4 py-3 text-muted">
        {file.duration ? `⏱ ${file.duration}s` : "—"}
      </td>

      <td className="px-4 py-3 text-right">
        <div className="flex justify-end gap-2 opacity-0 transition group-hover:opacity-100">
          <button
            onClick={() => onPreview(file)}
            className="rounded-md p-1 text-muted hover:bg-surface hover:text-foreground"
          >
            <Eye className="h-4 w-4" />
          </button>

          {mode === "trash" ? (
            <>
              <button
                onClick={() => onDelete(file.id)}
                title="Restore"
                className="rounded-md p-1 text-muted hover:bg-surface hover:text-primary"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              <button
                onClick={() => onForceDelete?.(file.id)}
                title="Delete forever"
                className="rounded-md p-1 text-muted hover:bg-surface hover:text-danger"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          ) : (
            <button
              onClick={() => onDelete(file.id)}
              title="Delete"
              className="rounded-md p-1 text-muted hover:bg-surface hover:text-danger"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
