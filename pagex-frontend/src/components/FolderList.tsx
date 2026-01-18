"use client";

import FolderRow from "./FolderRow";

interface Folder {
  id: string;
  name: string;
}

interface FolderListProps {
  folders: Folder[];
  activeFolderId: string | null;
  setActiveFolderId: (id: string | null) => void;
}

export default function FolderList({
  folders,
  activeFolderId,
  setActiveFolderId,
}: FolderListProps) {
  if (folders.length === 0) {
    return (
      <div className="px-3 py-2 text-sm text-muted-foreground">
        No folders
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {folders.map((folder) => (
        <FolderRow
          key={folder.id}
          folder={folder}
          isActive={activeFolderId === folder.id}
          onClick={() =>
            setActiveFolderId(
              activeFolderId === folder.id ? null : folder.id
            )
          }
        />
      ))}
    </div>
  );
}
