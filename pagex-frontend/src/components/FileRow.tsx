"use client";

import {
  Eye,
  Trash2,
  RotateCcw,
  Download,
} from "lucide-react";
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
  const handleDownload = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/files/${file.id}/download`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) return;

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = file.originalName;
    a.click();

    URL.revokeObjectURL(url);
  };

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

      {/* Name + Icon */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <FileTypeIcon mimetype={file.mimetype} />
          <span className="truncate font-medium text-foreground">
            {file.originalName}
          </span>
        </div>
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
          <button onClick={() => onPreview(file)}>
            <Eye className="h-4 w-4" />
          </button>

          {mode === "default" && (
            <button onClick={handleDownload}>
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
