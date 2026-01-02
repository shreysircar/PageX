"use client";

import { Eye, Trash2 } from "lucide-react";

interface Props {
  file: any;
  selected: boolean;
  onSelect: (id: string) => void;
  onPreview: (file: any) => void;
  onDelete: (fileId: string) => void;
}

export default function FileRow({
  file,
  selected,
  onSelect,
  onPreview,
  onDelete,
}: Props) {
  return (
    <tr className="group border-b border-border hover:bg-border">
      {/* Checkbox */}
      <td className="px-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(file.id)}
        />
      </td>

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
            onClick={() => onPreview(file)}
            className="rounded-md p-1 text-muted hover:bg-surface hover:text-foreground"
          >
            <Eye className="h-4 w-4" />
          </button>

          <button
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
