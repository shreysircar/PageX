"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { useRouter } from "next/navigation";
import { DndContext, DragEndEvent } from "@dnd-kit/core";

import FileUpload from "@/components/FileUpload";
import FileList from "@/components/FileList";
import SearchBar from "@/components/SearchBar";
import AppShell from "@/components/AppShell";
import FilePreview from "@/components/FilePreview";
import CreateFolderModal from "@/components/CreateFolderModal";
import RootRow from "@/components/RootRow";
import { useToast } from "@/components/ToastProvider";

type SearchType = "filename" | "semantic" | "keyword";

export default function DashboardClient() {
  const router = useRouter();
  const toast = useToast();

  /* -------------------- Core State -------------------- */
  const [files, setFiles] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [searchType, setSearchType] = useState<SearchType>("filename");
  const [loading, setLoading] = useState(true);

  /* -------------------- Folder State -------------------- */
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);

  /* -------------------- Preview -------------------- */
  const [previewFile, setPreviewFile] = useState<any | null>(null);

  /* -------------------- Multi-Select -------------------- */
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  /* -------------------- Fetchers -------------------- */
  const fetchFiles = async () => {
    try {
      const data = await apiRequest("/files");
      setFiles(data);
    } catch {
      localStorage.removeItem("token");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchFolders = async () => {
    const data = await apiRequest("/folders");
    setFolders(data);
  };

  useEffect(() => {
    fetchFiles();
    fetchFolders();
  }, []);

  /* -------------------- Drag & Drop -------------------- */
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const fileId = active.id as string;
    const overId = over.id as string;
    const folderId = overId === "root" ? null : overId;

    const file = files.find((f) => f.id === fileId);
    if (!file || file.folderId === folderId) return;

    try {
      await apiRequest(`/files/${fileId}/move`, {
        method: "PATCH",
        body: JSON.stringify({ folderId }),
      });

      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, folderId } : f
        )
      );
    } catch {
      toast("Failed to move file", "danger");
    }
  };

  /* -------------------- Derived Items -------------------- */
  let items: any[] = [];

  if (activeFolderId === null) {
    // ROOT VIEW → folders + root files
    items = [
      ...folders.map((f) => ({
        type: "folder",
        id: f.id,
        name: f.name,
      })),
      ...files
        .filter((f) => f.folderId === null)
        .map((f) => ({
          type: "file",
          ...f,
        })),
    ];
  } else {
    // FOLDER VIEW → only files
    items = files
      .filter((f) => f.folderId === activeFolderId)
      .map((f) => ({
        type: "file",
        ...f,
      }));
  }

  const activeFolderName =
    activeFolderId &&
    folders.find((f) => f.id === activeFolderId)?.name;

  /* -------------------- Folder Delete -------------------- */
  const handleDeleteFolder = async (folderId: string) => {
    await apiRequest(`/folders/${folderId}`, { method: "DELETE" });

    if (activeFolderId === folderId) {
      setActiveFolderId(null);
    }

    await fetchFolders();
    await fetchFiles();
    toast("Folder deleted");
  };

  /* -------------------- Render -------------------- */
  return (
    <AppShell>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="space-y-6">
          <SearchBar
            onResults={setSearchResults}
            onClear={() => setSearchResults(null)}
            onSearchType={setSearchType}
          />

          <CreateFolderModal onCreated={fetchFolders} />

          {/* 🔙 Breadcrumb */}
          {activeFolderId !== null && (
            <div className="flex items-center gap-2 text-sm text-muted">
              <button
                onClick={() => setActiveFolderId(null)}
                className="hover:underline"
              >
                ← All Files
              </button>
              <span>/</span>
              <span className="font-medium text-foreground">
                {activeFolderName}
              </span>
            </div>
          )}

          {/* 🧲 ROOT DROP TARGET (ONLY INSIDE FOLDER) */}
          {activeFolderId !== null && (
            <RootRow
              isActive={false}
              onClick={() => setActiveFolderId(null)}
            />
          )}

          {/* 📁 Unified List */}
          <FileList
            items={items}
            selectedIds={selectedIds}
            onSelect={(id) =>
              setSelectedIds((p) =>
                p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
              )
            }
            onSelectAll={() =>
              setSelectedIds(
                items
                  .filter((i) => i.type === "file")
                  .map((f) => f.id)
              )
            }
            onPreview={(file) => setPreviewFile(file)}
onDelete={async (id) => {
  await apiRequest(`/files/${id}`, { method: "DELETE" });
  await fetchFiles(); // 🔑 REQUIRED
  toast("Moved to trash");
}}

            onFolderClick={(folderId) =>
              setActiveFolderId(folderId)
            }
            onDeleteFolder={handleDeleteFolder}
          />

          <FileUpload
            folderId={activeFolderId}
            onUploadSuccess={fetchFiles}
          />
        </div>
      </DndContext>

      {previewFile && (
        <FilePreview
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </AppShell>
  );
}
