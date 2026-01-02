"use client";

interface Props {
  title: string;
  description: string;
  confirmText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  title,
  description,
  confirmText = "Confirm",
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-lg bg-surface p-5 shadow-lg">
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="mt-2 text-sm text-muted">{description}</p>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-md px-3 py-1.5 text-sm text-muted hover:bg-border"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="rounded-md bg-danger px-3 py-1.5 text-sm text-white hover:bg-danger/90"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
