interface Props {
  files: any[];
}

export default function FileList({ files }: Props) {
  if (files.length === 0) {
    return (
      <p className="text-sm text-muted">
        No files uploaded yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {files.map((file) => (
        <div
          key={file.id}
          className="
            rounded-lg border border-border bg-surface p-4
            transition hover:shadow-md hover:border-primary
          "
        >
          {/* File Header */}
          <div className="mb-2 flex items-start justify-between">
            <div>
              <p className="font-medium text-foreground">
                {file.originalName}
              </p>

              <p className="text-xs text-muted">
                {file.mimetype}
              </p>
            </div>

            {file.duration && (
              <span className="text-xs text-muted">
                ⏱ {file.duration}s
              </span>
            )}
          </div>

          {/* Extracted Preview */}
          {file.extractedText && (
            <p className="mt-2 text-xs text-muted line-clamp-3">
              {file.extractedText}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
