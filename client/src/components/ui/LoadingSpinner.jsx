import React from "react";

export const LoadingSpinner = ({
  size = "md",
  label = "Loading...",
  fullHeight = false,
  className = "",
}) => {
  const sizeClass =
    size === "xs"
      ? "loading-xs"
      : size === "sm"
      ? "loading-sm"
      : size === "lg"
      ? "loading-lg"
      : "loading-md";

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${
        fullHeight ? "h-64 sm:h-96" : "p-6"
      } ${className}`}
    >
      <span className={`loading loading-spinner text-primary ${sizeClass}`} />
      {label && (
        <span className="text-xs font-semibold text-base-content/60">
          {label}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;
