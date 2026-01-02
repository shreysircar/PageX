"use client";

import { Eye, Trash2 } from "lucide-react";

interface Props {
  file: any;
  onPreview: (file: any) => void;
  onDelete: (fileId: string) => void;
}

export default function FileRow({ file, onPreview, onDelete }: Props) {
  return (
    <tr className="group border-b border-border transition hover:bg-border">
      {/* Name */}
      <td className="px-4 py-3 font-medium text-foreground">
        {file.originalName}
      </td>

      {/* Type */}
      <td className="px-4 py-3 text-muted">
        {file.mimetype}
      </td>

      {/* Duration */}
      <td className="px-4 py-3 text-muted">
        {file.duration ? `⏱ ${file.duration}s` : "—"}
      </td>

      {/* Actions */}
      <td className="px-4 py-3 text-right">
        <div className="flex justify-end gap-2 opacity-0 transition group-hover:opacity-100">
          <button
            type="button"
            aria-label="Preview"
            onClick={() => onPreview(file)}
            className="rounded-md p-1 text-muted hover:bg-surface hover:text-foreground"
          >
            <Eye className="h-4 w-4" />
          </button>

          <button
            type="button"
            aria-label="Delete"
            onClick={() => onDelete(file.id)}
            className="rounded-md p-1 text-muted hover:bg-surface hover:text-danger"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
