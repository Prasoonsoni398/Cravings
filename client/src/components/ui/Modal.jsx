import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";

const MAX_WIDTHS = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
};

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  children,
  footer,
  maxWidth = "md",
  className = "",
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && onClose) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClass = MAX_WIDTHS[maxWidth] || MAX_WIDTHS.md;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`relative w-full ${widthClass} max-h-[90vh] overflow-y-auto rounded-3xl bg-base-100 p-6 shadow-2xl border border-base-200 z-10 transition-all ${className}`}
      >
        {(title || subtitle || badge) && (
          <div className="flex items-start justify-between border-b border-base-200 pb-4 mb-4">
            <div>
              {badge && <div className="mb-1">{badge}</div>}
              {title && (
                <h3 className="text-xl font-black text-base-content">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-base-content/60 mt-0.5">{subtitle}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-circle btn-sm btn-ghost text-base-content/60 hover:text-base-content"
              aria-label="Close modal"
            >
              <FiX className="text-lg" />
            </button>
          </div>
        )}

        <div>{children}</div>

        {footer && (
          <div className="mt-6 pt-4 border-t border-base-200 flex items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
