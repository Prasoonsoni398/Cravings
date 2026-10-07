import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiCheck } from "react-icons/fi";

export const Dropdown = ({
  label,
  icon = null,
  items = [],
  variant = "outline",
  size = "sm",
  align = "left",
  className = "",
  triggerClassName = "",
  menuClassName = "",
  customTrigger = null,
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
      {customTrigger ? (
        <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
          {typeof customTrigger === "function" ? customTrigger({ isOpen }) : customTrigger}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`btn btn-${variant} rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition ${sizeClasses} ${triggerClassName}`}
        >
          {icon && <span className="shrink-0">{icon}</span>}
          <span>{label}</span>
          <FiChevronDown className={`transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`} />
        </button>
      )}

      {isOpen && (
        <div
          className={`absolute ${alignClass} mt-2 min-w-44 rounded-2xl bg-base-100 p-1.5 shadow-2xl border border-base-200 z-50 animate-in fade-in-50 zoom-in-95 ${menuClassName}`}
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
              className={`flex w-full items-center justify-between gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-left transition cursor-pointer ${
                item.active
                  ? "bg-primary/10 text-primary font-bold"
                  : item.danger
                  ? "text-error hover:bg-error/10"
                  : "text-base-content hover:bg-base-200"
              } ${item.disabled ? "opacity-50 pointer-events-none" : ""}`}
            >
              <div className="flex items-center gap-2 truncate">
                {item.icon && <span className="text-sm shrink-0">{item.icon}</span>}
                <span className="truncate">{item.label}</span>
              </div>
              {item.active && <FiCheck className="text-primary text-sm shrink-0 ml-1.5" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
