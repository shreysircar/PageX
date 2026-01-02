"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/api";
import { ArrowRight } from "lucide-react";

interface Props {
  onResults: (results: any[]) => void;
  onClear: () => void;
}

export default function SearchBar({ onResults, onClear }: Props) {
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
      className="flex items-center gap-1 rounded-lg border border-border bg-surface px-2 py-1"
    >
      <input
        type="text"
        placeholder="Search documents by meaning…"
        className="flex-1 bg-transparent px-2 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none"
        value={query}
        onChange={(e) => {
          const value = e.target.value;
          setQuery(value);

          // ✅ THIS is the key behavior
          if (value.trim() === "") {
            onClear();
            setError("");
          }
        }}
      />

      <button
        type="submit"
        disabled={loading}
        aria-label="Search"
        className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition hover:bg-border hover:text-foreground disabled:opacity-50"
      >
        <ArrowRight className="h-4 w-4" />
      </button>

      {error && (
        <span className="ml-2 text-xs text-danger">
          {error}
        </span>
      )}
    </form>
  );
}
