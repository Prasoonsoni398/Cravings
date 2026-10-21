import React, { useEffect } from "react";
import ActionButton from "./ActionButton";

const MAX_WIDTHS = {
  xs: "max-w-xs",
  compact: "max-w-[380px]",
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  full: "max-w-full",
};

/**
 * Reusable animated Side Drawer / Slide-over Dialog component.
 * Supports sliding in from the right (or left), backdrop blur, Esc key listener,
 * body scroll lock, and sticky headers/footers.
 */
export const Drawer = ({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  children,
  footer,
  position = "right",
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
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const widthClass = MAX_WIDTHS[maxWidth] || MAX_WIDTHS.md;
  const isRight = position === "right";

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden transition-visibility duration-300 ${
        isOpen ? "pointer-events-auto visible" : "pointer-events-none invisible"
      }`}
      aria-hidden={!isOpen}
    >
      {/* Animated Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ease-in-out cursor-pointer ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Drawer Panel */}
      <div
        className={`fixed inset-y-0 ${isRight ? "right-0" : "left-0"} z-50 flex flex-col w-full ${widthClass} bg-base-100 shadow-2xl border-l border-base-200 transform transition-transform duration-300 ease-out ${
          isOpen
            ? "translate-x-0"
            : isRight
              ? "translate-x-full"
              : "-translate-x-full"
        } ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {/* Sticky Header */}
        <div className="shrink-0 flex items-center justify-between border-b border-base-200 px-4 sm:px-5 py-3.5 bg-base-100/95 backdrop-blur-md z-10">
          <div className="flex-1 min-w-0 pr-2">
            {badge && <div className="mb-1">{badge}</div>}
            {title && (
              <h2
                id="drawer-title"
                className="text-base sm:text-lg font-black text-base-content tracking-tight truncate"
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xs text-base-content/60 mt-0.5 truncate">
                {subtitle}
              </p>
            )}
          </div>

          <ActionButton.Close
            size="sm"
            onClick={onClose}
            title="Close drawer"
            className="shrink-0"
          />
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-3.5 space-y-4">
          {children}
        </div>

        {/* Sticky Footer */}
        {footer && (
          <div className="shrink-0 border-t border-base-200 px-4 sm:px-5 py-3.5 bg-base-100/95 backdrop-blur-md z-10">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Drawer;
