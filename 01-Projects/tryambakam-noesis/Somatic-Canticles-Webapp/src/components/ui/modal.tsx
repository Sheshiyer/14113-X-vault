"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { Button } from "./button";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  footer?: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  description,
  size = "md",
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  footer,
  className,
}) => {
  const modalRef = React.useRef<HTMLDivElement>(null);
  const previousActiveElement = React.useRef<HTMLElement | null>(null);

  // Handle escape key
  React.useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Focus trap and initial focus
  React.useEffect(() => {
    if (!isOpen) return;

    // Store previous active element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Focus the modal
    if (modalRef.current) {
      modalRef.current.focus();
    }

    // Prevent body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
      // Restore focus
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen]);

  // Handle tab key for focus trap
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab" || !modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  };

  const sizes = {
    sm: "max-w-[400px]",
    md: "max-w-[500px]",
    lg: "max-w-[700px]",
    xl: "max-w-[900px]",
    full: "max-w-[calc(100vw-44px)]",
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-[13px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      aria-describedby={description ? "modal-description" : undefined}
    >
      {/* Overlay with 13s unlock animation */}
      <div
        className="fixed inset-0 bg-black/50 animate-[fadeIn_800ms_ease-out]"
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal content with transform animation */}
      <div
        ref={modalRef}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className={cn(
          "relative z-10 w-full bg-white rounded-[13px] shadow-[0_8px_44px_rgba(0,0,0,0.2)]",
          "animate-[modalUnlock_1300ms_cubic-bezier(0.16,1,0.3,1)]",
          sizes[size],
          className
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between p-[21px] pb-[13px] border-b border-slate-100">
            <div className="flex-1 min-w-0">
              {title && (
                <h2
                  id="modal-title"
                  className="text-[21px] font-semibold text-slate-900"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p id="modal-description" className="text-[16px] text-slate-500 mt-[5px]">
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="flex-shrink-0 ml-[13px]"
                aria-label="Close modal"
              >
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
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </Button>
            )}
          </div>
        )}

        {/* Body */}
        <div
          className={cn(
            "p-[21px]",
            !title && !showCloseButton && "pt-[21px]"
          )}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-[13px] p-[21px] pt-[13px] border-t border-slate-100">
            {footer}
          </div>
        )}
      </div>

      {/* Animation keyframes */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes modalUnlock {
          0% {
            opacity: 0;
            transform: scale(0.95) translateY(13px);
          }
          44% {
            opacity: 1;
            transform: scale(1.02) translateY(-2px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export interface ConfirmModalProps extends Omit<ModalProps, "children" | "footer"> {
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "primary" | "secondary" | "unlock" | "outline";
  isConfirmLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "primary",
  isConfirmLoading = false,
  ...modalProps
}) => {
  return (
    <Modal
      {...modalProps}
      onClose={onCancel}
      footer={
        <>
          <Button variant="outline" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            isLoading={isConfirmLoading}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <p className="text-slate-700">
        Are you sure you want to proceed with this action?
      </p>
    </Modal>
  );
};
