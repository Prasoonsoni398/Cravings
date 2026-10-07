import React from "react";
import { FiSearch, FiX } from "react-icons/fi";

export const SearchInput = ({
  value,
  onChange,
  onSearch,
  onClear,
  placeholder = "Search...",
  size = "sm",
  className = "",
  autoFocus = false,
}) => {
  const sizeClasses = size === "sm" ? "input-sm text-xs py-1.5" : "text-sm py-2";

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(value);
    }
    if (e.key === "Escape" && onClear) {
      onClear();
    }
  };

  return (
    <div className={`relative flex items-center w-full min-w-[240px] ${className}`}>
      <FiSearch className="absolute left-3.5 text-base-content/40 text-sm pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={`input input-bordered w-full pl-9 pr-8 rounded-xl bg-base-100 transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 ${sizeClasses}`}
      />
      {value && (
        <button
          type="button"
          onClick={onClear || (() => onChange({ target: { value: "" } }))}
          className="absolute right-2.5 p-1 rounded-full text-base-content/40 hover:text-base-content hover:bg-base-200 transition"
          aria-label="Clear search"
        >
          <FiX className="text-xs" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
