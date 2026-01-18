import FileRow from "@/components/FileRow";
import FolderRow from "@/components/FolderRow";

type Item =
  | { type: "folder"; id: string; name: string }
  | { type: "file"; id: string; [key: string]: any };

interface Props {
  items: Item[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onSelectAll: () => void;
  onPreview: (file: any) => void;
  onDelete: (fileId: string) => void;
  onFolderClick: (folderId: string) => void;
  onDeleteFolder?: (folderId: string) => void;// ✅ REQUIRED
  onForceDelete?: (fileId: string) => void;
  mode?: "default" | "trash";
}

export default function FileList({
  items,
  selectedIds,
  onSelect,
  onSelectAll,
  onPreview,
  onDelete,
  onFolderClick,
  onDeleteFolder,
  onForceDelete,
  mode = "default",
}: Props) {
  const fileItems = items.filter((i) => i.type === "file") as any[];

  const allSelected =
    fileItems.length > 0 &&
    fileItems.every((f) => selectedIds.includes(f.id));

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

            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left w-[180px]">Type</th>
            <th className="px-4 py-2 text-left w-[120px]">Duration</th>
            <th className="px-4 py-2 text-right w-[140px]">Actions</th>
          </tr>
        </thead>

        <tbody>
          {items.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-8 text-center text-sm text-muted"
              >
                No files found
              </td>
            </tr>
          ) : (
            items.map((item) =>
              item.type === "folder" ? (
                <tr key={item.id} className="border-b border-border">
                  <td colSpan={5} className="px-0">
                    <FolderRow
                      folder={{ id: item.id, name: item.name }}
                      isActive={false}
                      onClick={() => onFolderClick(item.id)}
                      onDelete={onDeleteFolder}
                    />
                  </td>
                </tr>
              ) : (
<FileRow
  key={item.id}
  file={item}
  selected={selectedIds.includes(item.id)}
  onSelect={onSelect}        // ✅ RAW
  onPreview={onPreview}      // ✅ RAW
  onDelete={onDelete}        // ✅ RAW
  onForceDelete={onForceDelete}
  mode={mode}
/>


              )
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
