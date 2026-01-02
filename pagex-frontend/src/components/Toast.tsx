"use client";

import { CheckCircle, AlertTriangle } from "lucide-react";

export type ToastType = "success" | "danger";

export default function Toast({
  message,
  type = "success",
}: {
  message: string;
  type?: ToastType;
}) {
  const Icon =
    type === "success" ? CheckCircle : AlertTriangle;

  return (
    <div
      className={`
        pointer-events-auto flex items-center gap-2 rounded-lg px-4 py-2 text-sm shadow-lg
        ${
          type === "success"
            ? "bg-green-600 text-white"
            : "bg-red-600 text-white"
        }
      `}
    >
      <Icon className="h-4 w-4" />
      {message}
    </div>
  );
}
