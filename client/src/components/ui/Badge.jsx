import React from "react";

const VARIANTS = {
  primary: "badge-primary text-white",
  success: "badge-success text-white",
  warning: "badge-warning text-base-content",
  error: "badge-error text-white",
  info: "badge-info text-white",
  ghost: "badge-ghost text-base-content/80",
  neutral: "badge-neutral text-neutral-content",
  soft: "bg-primary/10 text-primary border-primary/20",
  successSoft: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  warningSoft: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  errorSoft: "bg-rose-500/10 text-rose-600 border-rose-500/20",
};

const SIZES = {
  xs: "badge-xs text-[10px] px-1.5 py-0.5",
  sm: "badge-sm text-xs px-2.5 py-1",
  md: "text-xs px-3 py-1.5",
};

export const Badge = ({
  children,
  variant = "primary",
  size = "sm",
  dot = false,
  pulse = false,
  className = "",
}) => {
  const variantClass = VARIANTS[variant] || VARIANTS.primary;
  const sizeClass = SIZES[size] || SIZES.sm;

  return (
    <span
      className={`badge rounded-lg font-bold inline-flex items-center gap-1.5 ${variantClass} ${sizeClass} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
        </span>
      )}
      {!pulse && dot && (
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-current"></span>
      )}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
