"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/api";

interface CreateFolderModalProps {
  onCreated: () => void;
}

export default function CreateFolderModal({
  onCreated,
}: CreateFolderModalProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!name.trim()) return;

    try {
      setLoading(true);
      await apiRequest("/folders", {
        method: "POST",
        body: JSON.stringify({ name }),
      });
      setName("");
      onCreated();
    } catch (err) {
      console.error("Create folder failed", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-2">
      <input
        className="flex-1 rounded-md border px-3 py-2 text-sm bg-background"
        placeholder="New folder name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        onClick={handleCreate}
        disabled={loading || !name.trim()}
        className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
      >
        Create
      </button>
    </div>
  );
}
