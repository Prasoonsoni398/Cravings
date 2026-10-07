import React from "react";

const VARIANTS = {
  primary: "btn-primary text-white shadow-sm hover:shadow-md",
  secondary: "btn-secondary text-white",
  outline: "btn-outline border-base-300 hover:border-primary hover:bg-primary hover:text-white",
  ghost: "btn-ghost hover:bg-base-200 text-base-content/80",
  success: "btn-success text-white",
  warning: "btn-warning text-white",
  error: "btn-error text-white",
  info: "btn-info text-white",
  soft: "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20",
};

const SIZES = {
  xs: "btn-xs text-xs px-2.5 py-1",
  sm: "btn-sm text-xs px-3.5 py-1.5",
  md: "text-sm px-4 py-2",
  lg: "btn-lg text-base px-6 py-3",
};

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  icon = null,
  iconPosition = "left",
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = "button",
  className = "",
  title,
}) => {
  const variantClass = VARIANTS[variant] || VARIANTS.primary;
  const sizeClass = SIZES[size] || SIZES.md;
  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      title={title}
      className={`btn rounded-xl font-bold transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer ${variantClass} ${sizeClass} ${widthClass} ${className}`}
    >
      {loading ? (
        <span className="loading loading-spinner loading-xs"></span>
      ) : (
        icon && iconPosition === "left" && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
      {!loading && icon && iconPosition === "right" && (
        <span className="shrink-0">{icon}</span>
      )}
    </button>
  );
};

export default Button;
