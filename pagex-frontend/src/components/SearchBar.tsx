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
      className="
        rounded-lg border border-border bg-surface p-4
        shadow-sm
      "
    >
      {/* Header */}
      <h2 className="mb-2 text-sm font-semibold tracking-wide text-foreground">
        🔍 AI Search
      </h2>

      {/* Error */}
      {error && (
        <p className="mb-2 text-sm text-danger">
          {error}
        </p>
      )}

      {/* Search Row */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Search by meaning (e.g. Amazon receipt)"
          className="
            flex-1 rounded-md border border-border bg-background px-3 py-2
            text-sm text-foreground placeholder:text-muted
            focus:outline-none focus:ring-2 focus:ring-primary
          "
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="
            rounded-md bg-primary px-4 py-2 text-sm font-medium text-white
            transition hover:bg-primary-hover disabled:opacity-50
          "
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
    </form>
  );
}
