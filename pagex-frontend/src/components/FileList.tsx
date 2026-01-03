import FileRow from "@/components/FileRow";

interface Props {
  files: any[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onSelectAll: () => void;
  onPreview: (file: any) => void;
  onDelete: (fileId: string) => void;
  onForceDelete?: (fileId: string) => void;
  mode?: "default" | "trash";
}

export default function FileList({
  files,
  selectedIds,
  onSelect,
  onSelectAll,
  onPreview,
  onDelete,
  onForceDelete,
  mode = "default",
}: Props) {
  const allSelected =
    files.length > 0 && files.every((f) => selectedIds.includes(f.id));

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-surface">
          <tr className="border-b border-border text-xs text-muted">
            <th className="w-10 px-3 py-2 text-left">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onSelectAll}
              />
            </th>

            {/* Wider name column for thumbnail + filename */}
            <th className="px-4 py-2 text-left">
              Name
            </th>

            <th className="px-4 py-2 text-left w-[180px]">
              Type
            </th>

            <th className="px-4 py-2 text-left w-[120px]">
              Duration
            </th>

            <th className="px-4 py-2 text-right w-[140px]">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {files.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-8 text-center text-sm text-muted"
              >
                No files found
              </td>
            </tr>
          ) : (
            files.map((file) => (
              <FileRow
                key={file.id}
                file={file}
                selected={selectedIds.includes(file.id)}
                onSelect={onSelect}
                onPreview={onPreview}
                onDelete={onDelete}
                onForceDelete={onForceDelete}
                mode={mode}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
