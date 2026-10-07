import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";

export const Dropdown = ({
  label,
  icon = null,
  items = [],
  variant = "outline",
  size = "sm",
  align = "left",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sizeClasses = size === "xs" ? "btn-xs text-xs" : size === "sm" ? "btn-sm text-xs" : "text-sm";
  const alignClass = align === "right" ? "right-0" : "left-0";

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`btn btn-${variant} rounded-xl font-bold flex items-center gap-1.5 cursor-pointer ${sizeClasses}`}
      >
        {icon && <span>{icon}</span>}
        <span>{label}</span>
        <FiChevronDown className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          className={`absolute ${alignClass} mt-2 w-48 rounded-2xl bg-base-100 p-1.5 shadow-xl border border-base-200 z-50 animate-in fade-in-50 zoom-in-95`}
        >
          {items.map((item, idx) => (
            <button
              key={idx}
              type="button"
              disabled={item.disabled}
              onClick={() => {
                if (item.onClick) item.onClick();
                setIsOpen(false);
              }}
              className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-left transition cursor-pointer ${
                item.danger
                  ? "text-error hover:bg-error/10"
                  : "text-base-content hover:bg-base-200"
              } ${item.disabled ? "opacity-50 pointer-events-none" : ""}`}
            >
              {item.icon && <span className="text-sm shrink-0">{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
