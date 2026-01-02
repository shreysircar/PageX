"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { useRouter } from "next/navigation";

import FileUpload from "@/components/FileUpload";
import FileList from "@/components/FileList";
import SearchBar from "@/components/SearchBar";
import ThemeToggle from "@/components/ThemeToggle";

export default function DashboardClient() {
  const router = useRouter();

  const [files, setFiles] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Utility Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-surface">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-3">
          <h1 className="text-lg font-semibold tracking-tight">
            📂 PageX
          </h1>

          <div className="flex-1">
            <SearchBar onResults={setSearchResults} />
          </div>

          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl space-y-6 px-6 py-6">
        <FileUpload onUploadSuccess={fetchFiles} />

        {loading ? (
          <p className="text-muted">Loading files...</p>
        ) : searchResults ? (
          <>
            <h2 className="font-semibold">Search Results</h2>
            <FileList files={searchResults} />
          </>
        ) : (
          <>
            <h2 className="font-semibold">Your Files</h2>
            <FileList files={files} />
          </>
        )}
      </main>
    </div>
  );
}
