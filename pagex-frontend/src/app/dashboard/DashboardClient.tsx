"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { useRouter } from "next/navigation";

import FileUpload from "@/components/FileUpload";
import FileList from "@/components/FileList";
import SearchBar from "@/components/SearchBar";
import AppShell from "@/components/AppShell";
import FilePreview from "@/components/FilePreview";
import { useToast } from "@/components/ToastProvider";

type SearchType = "filename" | "semantic" | "keyword";

export default function DashboardClient() {
  const router = useRouter();
  const toast = useToast();

  /* -------------------- Core State -------------------- */
  const [files, setFiles] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [searchType, setSearchType] = useState<SearchType>("filename");
  const [loading, setLoading] = useState(true);

  /* -------------------- Preview -------------------- */
  const [previewFile, setPreviewFile] = useState<any | null>(null);

  /* -------------------- Sort & Filter -------------------- */
  const [sortBy, setSortBy] = useState<"name" | "type" | "date">("name");
  const [filterType, setFilterType] = useState<
    "all" | "pdf" | "image" | "audio" | "text"
  >("all");

  /* -------------------- Multi-Select -------------------- */
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  /* -------------------- Fetch Files -------------------- */
  const fetchFiles = async () => {
    try {
      const data = await apiRequest("/files");
      setFiles(data);
    } catch (err) {
      localStorage.removeItem("token");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  /* -------------------- Row Actions -------------------- */
  const handlePreview = (file: any) => {
    setPreviewFile(file);
  };

  const handleDelete = async (fileId: string) => {
    try {
      await apiRequest(`/files/${fileId}`, { method: "DELETE" });

      setFiles((prev) => prev.filter((f) => f.id !== fileId));
      setSearchResults((prev) =>
        prev ? prev.filter((f) => f.id !== fileId) : prev
      );
      setSelectedIds((prev) => prev.filter((id) => id !== fileId));

      toast("Moved to trash");
    } catch (err) {
      console.error("Delete failed", err);
      toast("Delete failed", "danger");
    }
  };

  /* -------------------- Derived View -------------------- */
  const activeFiles = searchResults ?? files;

  const filteredFiles = activeFiles.filter((file) => {
    if (filterType === "all") return true;

    const type = file.mimetype.toLowerCase();
    if (filterType === "pdf") return type.includes("pdf");
    if (filterType === "image") return type.startsWith("image/");
    if (filterType === "audio") return type.startsWith("audio/");
    if (filterType === "text") return type.startsWith("text/");
    return true;
  });

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    if (sortBy === "name") {
      return a.originalName.localeCompare(b.originalName);
    }
    if (sortBy === "type") {
      return a.mimetype.localeCompare(b.mimetype);
    }
    if (sortBy === "date") {
      const da = new Date(a.createdAt ?? 0).getTime();
      const db = new Date(b.createdAt ?? 0).getTime();
      return db - da;
    }
    return 0;
  });

  /* -------------------- Selection Logic -------------------- */
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === sortedFiles.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(sortedFiles.map((f) => f.id));
    }
  };

  const handleBulkDelete = async () => {
    for (const id of selectedIds) {
      await handleDelete(id);
    }
    setSelectedIds([]);
    toast("Selected files moved to trash");
  };

  /* -------------------- Render -------------------- */
  return (
    <AppShell>
      <div className="space-y-6">
        {/* SEARCH */}
        <SearchBar
          onResults={setSearchResults}
          onClear={() => {
            setSearchResults(null);
            setSearchType("filename");
          }}
          onSearchType={setSearchType}
        />

        {/* 🔎 SEMANTIC SEARCH HINT */}
        {searchResults && searchType === "semantic" && (
          <p className="text-xs text-muted">
            Showing results by content
          </p>
        )}

        {/* SORT & FILTER */}
        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-md border border-border bg-surface px-2 py-1 text-xs"
          >
            <option value="name">Sort by Name</option>
            <option value="type">Sort by Type</option>
            <option value="date">Sort by Date</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="rounded-md border border-border bg-surface px-2 py-1 text-xs"
          >
            <option value="all">All Types</option>
            <option value="pdf">PDF</option>
            <option value="image">Image</option>
            <option value="audio">Audio</option>
            <option value="text">Text</option>
          </select>
        </div>

        {/* BULK ACTION BAR */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-4 rounded-md border border-border bg-surface px-3 py-2">
            <span className="text-xs text-muted">
              {selectedIds.length} selected
            </span>
            <button
              onClick={handleBulkDelete}
              className="text-xs font-medium text-danger hover:underline"
            >
              Delete selected
            </button>
          </div>
        )}

        {/* RESULTS */}
        {loading ? (
          <p className="text-muted">Loading files...</p>
        ) : (
          <>
            <h2 className="text-xs font-medium uppercase tracking-wide text-muted">
              {searchResults ? "Search Results" : "All Files"}
            </h2>

            <FileList
              files={sortedFiles}
              selectedIds={selectedIds}
              onSelect={toggleSelect}
              onSelectAll={selectAll}
              onPreview={handlePreview}
              onDelete={handleDelete}
            />
          </>
        )}

        {/* UPLOAD */}
        <div className="pt-4 border-t border-border">
          <FileUpload onUploadSuccess={fetchFiles} />
        </div>
      </div>

      {/* FILE PREVIEW */}
      {previewFile && (
        <FilePreview
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </AppShell>
  );
}
