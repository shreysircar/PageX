"use client";

import { X } from "lucide-react";

interface Props {
  file: any;
  onClose: () => void;
}

export default function FilePreview({ file, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
      {/* Panel */}
      <div className="h-full w-full max-w-md bg-background shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <h2 className="text-sm font-medium text-foreground">
              {file.originalName}
            </h2>
            <p className="text-xs text-muted">
              {file.mimetype}
            </p>
          </div>

          <button
            aria-label="Close preview"
            onClick={onClose}
            className="rounded-md p-1 text-muted hover:bg-border hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="h-full overflow-y-auto px-4 py-4 pb-20">
          {file.duration && (
            <p className="mb-3 text-xs text-muted">
              ⏱ Duration: {file.duration}s
            </p>
          )}

          {file.extractedText ? (
            <pre className="whitespace-pre-wrap text-sm text-foreground">
              {file.extractedText}
            </pre>
          ) : (
            <p className="text-sm text-muted">
              No preview available for this file.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
