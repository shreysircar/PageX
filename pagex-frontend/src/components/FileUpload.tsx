"use client";

import { useState } from "react";

interface Props {
  onUploadSuccess: () => void;
}

export default function FileUpload({ onUploadSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError("");

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/files/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }

      setFile(null);
      onUploadSuccess();
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <h2 className="mb-3 text-sm font-semibold tracking-wide text-foreground">
        Upload File
      </h2>

      {/* Error */}
      {error && (
        <p className="mb-3 text-sm text-danger">
          {error}
        </p>
      )}

      {/* Upload Row */}
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border px-4 py-2 text-sm text-muted hover:bg-border transition">
          <span>📄 Choose file</span>
          <input
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>

        {file && (
          <span className="text-sm text-muted">
            {file.name}
          </span>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="
            ml-auto rounded-md bg-primary px-4 py-2 text-sm font-medium text-white
            transition hover:bg-primary-hover disabled:opacity-50
          "
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
}
