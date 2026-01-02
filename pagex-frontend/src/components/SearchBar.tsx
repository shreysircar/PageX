"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/api";

interface Props {
  onResults: (results: any[]) => void;
}

export default function SearchBar({ onResults }: Props) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await apiRequest("/search", {
        method: "POST",
        body: JSON.stringify({ query }),
      });

      onResults(res.results);
    } catch (err: any) {
      setError(err.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white p-4 rounded shadow mb-6"
    >
      <h2 className="font-semibold mb-2">🔍 AI Search</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search by meaning (e.g. amazon receipt)"
          className="flex-1 border p-2 rounded"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
    </form>
  );
}
