"use client";

import {
  createContext,
  useContext,
  useState,
} from "react";
import Toast, { ToastType } from "./Toast";

type ToastFn = (message: string, type?: ToastType) => void;

const ToastContext = createContext<ToastFn | null>(null);

export function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const showToast: ToastFn = (
    message,
    type = "success"
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50">
          <Toast
            message={toast.message}
            type={toast.type}
          />
        </div>
      )}
    </ToastContext.Provider>
  );
}

/* -------------------- Hook -------------------- */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error(
      "useToast must be used inside ToastProvider"
    );
  }
  return ctx;
}
