import FileRow from "@/components/FileRow";

interface Props {
  files: any[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onSelectAll: () => void;
  onPreview: (file: any) => void;
  onDelete: (fileId: string) => void;
  onForceDelete?: (fileId: string) => void; // ✅ ADD THIS
  mode?: "default" | "trash";               // already added earlier
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
    <div className="overflow-hidden rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-surface">
          <tr className="border-b border-border text-xs text-muted">
            <th className="px-3">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onSelectAll}
              />
            </th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Type</th>
            <th className="px-4 py-2 text-left">Duration</th>
            <th className="px-4 py-2 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {files.map((file) => (
            <FileRow
              key={file.id}
              file={file}
              selected={selectedIds.includes(file.id)}
              onSelect={onSelect}
              onPreview={onPreview}
              onDelete={onDelete}
              onForceDelete={onForceDelete} // ✅ PASS THROUGH
              mode={mode}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
