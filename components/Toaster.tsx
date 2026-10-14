"use client";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";
interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

// Global toast queue
let addToastFn: ((type: ToastType, message: string) => void) | null = null;
export const toast = {
  success: (msg: string) => addToastFn?.("success", msg),
  error: (msg: string) => addToastFn?.("error", msg),
  warning: (msg: string) => addToastFn?.("warning", msg),
  info: (msg: string) => addToastFn?.("info", msg),
};

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colors = {
  success: "var(--secondary)",
  error: "var(--danger)",
  warning: "var(--accent)",
  info: "var(--info)",
};

export function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    addToastFn = (type, message) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    };
    return () => { addToastFn = null; };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "0.625rem",
      }}
    >
      {toasts.map((t) => {
        const Icon = icons[t.type];
        return (
          <div
            key={t.id}
            className="toast"
            style={{ borderLeft: `4px solid ${colors[t.type]}` }}
          >
            <Icon size={20} style={{ color: colors[t.type], flexShrink: 0 }} />
            <span style={{ fontSize: "0.9375rem", color: "var(--text)", flex: 1 }}>{t.message}</span>
            <button
              onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "0.25rem" }}
              aria-label="Dismiss notification"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
