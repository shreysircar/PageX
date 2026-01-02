interface Props {
  files: any[];
}

export default function FileList({ files }: Props) {
  if (files.length === 0) {
    return <p>No files uploaded yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {files.map((file) => (
        <div
          key={file.id}
          className="bg-white p-4 rounded shadow"
        >
          <p className="font-semibold">{file.originalName}</p>

          <p className="text-sm text-gray-600">
            {file.mimetype}
          </p>

          {file.duration && (
            <p className="text-sm">⏱ {file.duration}s</p>
          )}

          {file.extractedText && (
            <p className="text-xs text-gray-500 mt-2 line-clamp-3">
              {file.extractedText}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
