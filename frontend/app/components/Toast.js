"use client";

import { useEffect, useState } from "react";

/**
 * Usage:
 *   const { toast, showToast } = useToast();
 *   showToast("Pesan error", "error");   // "error" | "success" | "info"
 *   return <>{toast}</>
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "error") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const STYLES = {
    error:   "bg-red-50 border-red-200 text-red-700",
    success: "bg-emerald-50 border-emerald-200 text-emerald-700",
    info:    "bg-indigo-50 border-indigo-200 text-indigo-700",
  };

  const ICONS = {
    error:   "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    success: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    info:    "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  };

  const toast = toasts.length > 0 ? (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map(({ id, message, type }) => (
        <div
          key={id}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg text-sm font-medium max-w-sm animate-in slide-in-from-right-4 ${STYLES[type]}`}
        >
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICONS[type]} />
          </svg>
          {message}
        </div>
      ))}
    </div>
  ) : null;

  return { toast, showToast };
}
