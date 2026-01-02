"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import AppShell from "@/components/AppShell";
import FileList from "@/components/FileList";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useToast } from "@/components/ToastProvider";

export default function TrashPage() {
  const toast = useToast();

  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [confirmEmpty, setConfirmEmpty] = useState(false);

  const fetchTrash = async () => {
    try {
      const data = await apiRequest("/files/trash");
      setFiles(data);
    } catch (err) {
      console.error("Failed to load trash", err);
      toast("Failed to load trash", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrash();
  }, []);

  /* -------------------- Restore -------------------- */
  const handleRestore = async (id: string) => {
    try {
      await apiRequest(`/files/${id}/restore`, { method: "POST" });
      setFiles((prev) => prev.filter((f) => f.id !== id));
      toast("File restored");
    } catch {
      toast("Restore failed", "danger");
    }
  };

  /* -------------------- Delete Forever -------------------- */
  const handleForceDelete = async () => {
    if (!confirmId) return;

    try {
      await apiRequest(`/files/${confirmId}/force`, {
        method: "DELETE",
      });

      setFiles((prev) => prev.filter((f) => f.id !== confirmId));
      toast("File permanently deleted", "danger");
    } catch {
      toast("Delete failed", "danger");
    } finally {
      setConfirmId(null);
    }
  };

  /* -------------------- Empty Trash -------------------- */
  const handleEmptyTrash = async () => {
    try {
      for (const file of files) {
        await apiRequest(`/files/${file.id}/force`, {
          method: "DELETE",
        });
      }

      setFiles([]);
      toast("Trash emptied", "danger");
    } catch {
      toast("Failed to empty trash", "danger");
    } finally {
      setConfirmEmpty(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-sm font-medium">Trash</h1>
            <p className="text-xs text-muted">
              Files are permanently deleted after 30 days
            </p>
          </div>

          {files.length > 0 && (
            <button
              onClick={() => setConfirmEmpty(true)}
              className="text-xs text-danger hover:underline"
            >
              Empty Trash
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-muted">Loading trash…</p>
        ) : files.length === 0 ? (
          <p className="text-sm text-muted">Trash is empty</p>
        ) : (
          <FileList
            files={files}
            selectedIds={[]}
            onSelect={() => {}}
            onSelectAll={() => {}}
            onPreview={() => {}}
            onDelete={handleRestore}
            onForceDelete={(id) => setConfirmId(id)}
            mode="trash"
          />
        )}
      </div>

      {/* Delete Forever Confirm */}
      {confirmId && (
        <ConfirmDialog
          title="Delete file forever?"
          description="This action cannot be undone."
          confirmText="Delete"
          onCancel={() => setConfirmId(null)}
          onConfirm={handleForceDelete}
        />
      )}

      {/* Empty Trash Confirm */}
      {confirmEmpty && (
        <ConfirmDialog
          title="Empty Trash?"
          description="All files in trash will be permanently deleted."
          confirmText="Empty Trash"
          onCancel={() => setConfirmEmpty(false)}
          onConfirm={handleEmptyTrash}
        />
      )}
    </AppShell>
  );
}
