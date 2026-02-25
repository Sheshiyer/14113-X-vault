"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export type ToastType = "info" | "success" | "warning" | "error" | "unlock";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ToastItemProps extends Toast {
  onClose: (id: string) => void;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

export const ToastItem: React.FC<ToastItemProps> = ({
  id,
  type,
  title,
  message,
  duration = 8000, // 8-second default (power number)
  action,
  onClose,
  position = "top-right",
}) => {
  const [isExiting, setIsExiting] = React.useState(false);
  const [progress, setProgress] = React.useState(100);

  React.useEffect(() => {
    if (duration === Infinity) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        handleClose();
      }
    }, 80); // Update every 80ms (power number)

    return () => clearInterval(interval);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(id), 800); // 800ms exit animation
  };

  const icons = {
    info: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-architect"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    ),
    success: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-world"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    ),
    warning: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-solar"
      >
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </svg>
    ),
    error: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-life"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="15" x2="9" y1="9" y2="15" />
        <line x1="9" x2="15" y1="9" y2="15" />
      </svg>
    ),
    unlock: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-transform"
      >
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 9.9-1" />
      </svg>
    ),
  };

  const styles = {
    info: "border-l-4 border-l-architect bg-white",
    success: "border-l-4 border-l-world bg-white",
    warning: "border-l-4 border-l-solar bg-white",
    error: "border-l-4 border-l-life bg-white",
    unlock: "border-l-4 border-l-transform bg-gradient-to-r from-transform/5 to-transparent",
  };

  const enterAnimations = {
    "top-right": "animate-[toastEnterRight_800ms_ease-out]",
    "top-left": "animate-[toastEnterLeft_800ms_ease-out]",
    "bottom-right": "animate-[toastEnterRight_800ms_ease-out]",
    "bottom-left": "animate-[toastEnterLeft_800ms_ease-out]",
  };

  const exitAnimation = "animate-[toastExit_800ms_ease-in_forwards]";

  return (
    <div
      className={cn(
        "relative w-full max-w-[400px] rounded-[8px] shadow-[0_4px_21px_rgba(0,0,0,0.15)] overflow-hidden",
        styles[type],
        enterAnimations[position],
        isExiting && exitAnimation
      )}
      role="alert"
    >
      {/* Progress bar */}
      {duration !== Infinity && (
        <div className="absolute bottom-0 left-0 h-[2px] bg-slate-200 w-full">
          <div
            className={cn(
              "h-full transition-all duration-8",
              type === "unlock" ? "bg-transform" : "bg-slate-400"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="flex items-start gap-[13px] p-[13px]">
        <div className="flex-shrink-0 mt-[2px]">{icons[type]}</div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-900">{title}</h4>
          {message && <p className="text-[14px] text-slate-600 mt-[3px]">{message}</p>}
          {action && (
            <button
              onClick={() => {
                action.onClick();
                handleClose();
              }}
              className="mt-[8px] text-[13px] font-medium text-transform hover:text-transform-dark transition-colors duration-8"
            >
              {action.label}
            </button>
          )}
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors duration-8"
          aria-label="Close notification"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      {/* Unlock sparkle animation */}
      {type === "unlock" && !isExiting && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[44px] h-[44px] animate-[sparkle_1300ms_ease-out]">
            <svg viewBox="0 0 100 100" className="w-full h-full text-transform/30">
              <path d="M50 0 L52 48 L100 50 L52 52 L50 100 L48 52 L0 50 L48 48 Z" fill="currentColor" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

// Toast container for managing multiple toasts
export interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  className?: string;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onClose,
  position = "top-right",
  className,
}) => {
  const positions = {
    "top-right": "top-[21px] right-[21px]",
    "top-left": "top-[21px] left-[21px]",
    "bottom-right": "bottom-[21px] right-[21px]",
    "bottom-left": "bottom-[21px] left-[21px]",
  };

  return (
    <div
      className={cn(
        "fixed z-[100] flex flex-col gap-[13px] pointer-events-none",
        positions[position],
        position.startsWith("bottom") ? "flex-col-reverse" : "flex-col",
        className
      )}
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem {...toast} onClose={onClose} position={position} />
        </div>
      ))}
    </div>
  );
};

// Toast context provider for app-wide toast management
export interface ToastContextType {
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const ToastContext = React.createContext<ToastContextType | undefined>(
  undefined
);

export interface ToastProviderProps {
  children: React.ReactNode;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = "top-right",
}) => {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((toast: Omit<Toast, "id">) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearToasts = React.useCallback(() => {
    setToasts([]);
  }, []);

  const value = React.useMemo(
    () => ({ addToast, removeToast, clearToasts }),
    [addToast, removeToast, clearToasts]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} position={position} />
      <style jsx global>{`
        @keyframes toastEnterRight {
          from {
            opacity: 0;
            transform: translateX(100%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        @keyframes toastEnterLeft {
          from {
            opacity: 0;
            transform: translateX(-100%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        @keyframes toastExit {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.95);
          }
        }
        @keyframes sparkle {
          0% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
          }
          100% {
            opacity: 0;
            transform: scale(0) rotate(360deg);
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

// Hook for using toasts
export const useToast = (): ToastContextType => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
