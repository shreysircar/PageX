import FileRow from "@/components/FileRow";

interface Props {
  files: any[];
  onPreview: (file: any) => void;
  onDelete: (fileId: string) => void;
}

export default function FileList({ files, onPreview, onDelete }: Props) {
  if (files.length === 0) {
    return <p className="text-sm text-muted">No files available.</p>;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-surface">
          <tr className="border-b border-border text-left text-xs font-medium text-muted">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Duration</th>
            <th className="px-4 py-2 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {files.map((file) => (
            <FileRow
              key={file.id}
              file={file}
              onPreview={onPreview}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
