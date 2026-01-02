"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { useRouter } from "next/navigation";
import FileUpload from "@/components/FileUpload";
import FileList from "@/components/FileList";
import SearchBar from "@/components/SearchBar";


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
      // token invalid / missing
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
  <div className="p-6 max-w-5xl mx-auto">
    <h1 className="text-2xl font-bold mb-4">📂 PageX Dashboard</h1>

    <SearchBar onResults={setSearchResults} />

    <FileUpload onUploadSuccess={fetchFiles} />

    {loading ? (
      <p>Loading files...</p>
    ) : searchResults ? (
      <>
        <h2 className="font-semibold mb-2">Search Results</h2>
        <FileList files={searchResults} />
      </>
    ) : (
      <>
        <h2 className="font-semibold mb-2">Your Files</h2>
        <FileList files={files} />
      </>
    )}
  </div>
);

}
