import React from "react";
import {
  FiPlus,
  FiX,
  FiTrash2,
  FiEdit2,
  FiEye,
  FiCheck,
  FiRefreshCw,
} from "react-icons/fi";

const ACTION_CONFIG = {
  add: {
    label: "Add",
    icon: FiPlus,
    defaultVariant: "primary",
    ariaLabel: "Add",
    iconAnimation: "group-hover:rotate-90 group-hover:scale-110",
  },
  cancel: {
    label: "Cancel",
    icon: FiX,
    defaultVariant: "cancel",
    ariaLabel: "Cancel",
    iconAnimation: "group-hover:rotate-90 group-hover:scale-110",
  },
  close: {
    label: "Close",
    icon: FiX,
    defaultVariant: "close",
    ariaLabel: "Close",
    iconAnimation: "group-hover:rotate-90 group-hover:scale-110",
  },
  delete: {
    label: "Delete",
    icon: FiTrash2,
    defaultVariant: "delete",
    ariaLabel: "Delete",
    iconAnimation: "group-hover:scale-115 group-hover:-rotate-6",
  },
  edit: {
    label: "Edit",
    icon: FiEdit2,
    defaultVariant: "edit",
    ariaLabel: "Edit",
    iconAnimation: "group-hover:-rotate-12 group-hover:scale-110",
  },
  view: {
    label: "View",
    icon: FiEye,
    defaultVariant: "view",
    ariaLabel: "View details",
    iconAnimation: "group-hover:scale-115",
  },
  save: {
    label: "Save",
    icon: FiCheck,
    defaultVariant: "primary",
    ariaLabel: "Save changes",
    iconAnimation: "group-hover:scale-115",
  },
  confirm: {
    label: "Confirm",
    icon: FiCheck,
    defaultVariant: "primary",
    ariaLabel: "Confirm",
    iconAnimation: "group-hover:scale-115",
  },
  refresh: {
    label: "Refresh",
    icon: FiRefreshCw,
    defaultVariant: "ghost",
    ariaLabel: "Refresh",
    iconAnimation: "group-hover:rotate-180",
  },
};

const VARIANTS = {
  // Primary (Add, Save, Confirm)
  primary:
    "bg-primary text-white border border-primary/90 shadow-sm hover:shadow-md hover:shadow-primary/25 hover:brightness-105 hover:-translate-y-0.5",
  secondary:
    "bg-secondary text-secondary-content border border-secondary shadow-sm hover:opacity-95 hover:shadow-md hover:-translate-y-0.5",
  
  // Interactive Cancel (Red color effect on hover & subtle red tint)
  cancel:
    "border border-rose-200/90 bg-rose-50/70 text-rose-600 hover:bg-rose-600 hover:text-white hover:border-rose-600 shadow-xs hover:shadow-md hover:shadow-rose-500/25 hover:-translate-y-0.5",
  "cancel-outline":
    "border border-rose-300 bg-transparent text-rose-600 hover:bg-rose-600 hover:text-white hover:border-rose-600 hover:shadow-md hover:shadow-rose-500/25 hover:-translate-y-0.5",
  "cancel-ghost":
    "bg-transparent text-rose-600 hover:bg-rose-100/80 hover:text-rose-700 hover:-translate-y-0.5",

  // Interactive Close (Circular button with red highlight effect)
  close:
    "border border-base-300/80 bg-base-100 text-base-content/70 hover:bg-rose-500 hover:text-white hover:border-rose-500 hover:shadow-md hover:shadow-rose-500/30 hover:scale-105",

  // Interactive Delete (Vibrant red with glowing shadow on hover)
  delete:
    "bg-rose-600 text-white border border-rose-600 shadow-sm hover:bg-rose-700 hover:border-rose-700 hover:shadow-md hover:shadow-rose-600/30 hover:-translate-y-0.5",
  "delete-soft":
    "border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white hover:border-rose-600 hover:shadow-md hover:shadow-rose-500/25 hover:-translate-y-0.5",
  "delete-ghost":
    "bg-transparent text-rose-600 hover:bg-rose-100/90 hover:text-rose-700 hover:scale-105",
  
  // Edit
  edit:
    "border border-amber-200/80 bg-amber-50/70 text-amber-700 hover:bg-amber-500 hover:text-white hover:border-amber-500 hover:shadow-md hover:shadow-amber-500/20 hover:-translate-y-0.5",
  "edit-ghost":
    "bg-transparent text-base-content/70 hover:bg-amber-100/80 hover:text-amber-800 hover:scale-105",

  // View
  view:
    "border border-base-300/80 bg-base-100 text-base-content/80 hover:bg-primary/10 hover:text-primary hover:border-primary/40 hover:-translate-y-0.5",
  "view-ghost":
    "bg-transparent text-base-content/70 hover:bg-base-200 hover:text-base-content hover:scale-105",

  // Outline, Ghost, and Soft fallbacks
  outline:
    "border border-base-300 bg-transparent text-base-content hover:border-primary hover:bg-primary hover:text-white hover:-translate-y-0.5 hover:shadow-sm",
  ghost:
    "bg-transparent text-base-content/80 hover:bg-base-200 hover:text-base-content hover:-translate-y-0.5",
  soft:
    "bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white hover:border-primary hover:shadow-md hover:shadow-primary/20 hover:-translate-y-0.5",
  error:
    "bg-rose-600 text-white border border-rose-600 shadow-sm hover:bg-rose-700 hover:shadow-md hover:shadow-rose-600/30 hover:-translate-y-0.5",
  success:
    "bg-emerald-600 text-white border border-emerald-600 shadow-sm hover:bg-emerald-700 hover:shadow-md hover:shadow-emerald-600/30 hover:-translate-y-0.5",
};

const SIZES = {
  xs: {
    button: "text-xs px-2.5 py-1 min-h-7 gap-1.5",
    iconOnly: "w-7 h-7 min-w-7 min-h-7 text-xs",
    icon: "text-xs",
  },
  sm: {
    button: "text-xs px-3.5 py-1.5 min-h-8 gap-2",
    iconOnly: "w-8 h-8 min-w-8 min-h-8 text-sm",
    icon: "text-sm",
  },
  md: {
    button: "text-sm px-4 py-2 min-h-10 gap-2",
    iconOnly: "w-10 h-10 min-w-10 min-h-10 text-base",
    icon: "text-base",
  },
  lg: {
    button: "text-base px-5 py-2.5 min-h-12 gap-2.5",
    iconOnly: "w-12 h-12 min-w-12 min-h-12 text-lg",
    icon: "text-lg",
  },
};

const SHAPES = {
  rounded: "rounded-xl",
  circle: "rounded-full",
  square: "rounded-xl",
  pill: "rounded-full",
};

/**
 * Interactive ActionButton component with rich hover animations and red effects for cancel/delete.
 */
export const ActionButton = ({
  action = "add",
  variant,
  size = "md",
  shape,
  iconOnly = false,
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = "button",
  className = "",
  title,
  children,
  ...props
}) => {
  const config = ACTION_CONFIG[action] || ACTION_CONFIG.add;

  // Determine if it should render as icon-only
  const isIconOnly =
    iconOnly ||
    (action === "close" && children === undefined) ||
    children === false;

  // Effective variant with smart defaults for icon-only action buttons
  const effectiveVariant =
    variant ||
    (action === "delete" && isIconOnly
      ? "delete-ghost"
      : action === "edit" && isIconOnly
      ? "edit-ghost"
      : action === "view" && isIconOnly
      ? "view-ghost"
      : action === "cancel" && isIconOnly
      ? "cancel-ghost"
      : config.defaultVariant);

  // Effective shape
  const effectiveShape =
    shape || (isIconOnly || action === "close" ? "circle" : "rounded");

  const variantClass = VARIANTS[effectiveVariant] || VARIANTS.primary;
  const sizeConfig = SIZES[size] || SIZES.md;
  const shapeClass = SHAPES[effectiveShape] || SHAPES.rounded;
  const widthClass = fullWidth && !isIconOnly ? "w-full" : "";

  // Icon component selection
  const IconComponent = icon !== undefined ? icon : config.icon;
  const buttonTitle = title || config.ariaLabel;
  const iconAnimation = config.iconAnimation || "group-hover:scale-110";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      title={buttonTitle}
      aria-label={buttonTitle}
      className={`group inline-flex items-center justify-center font-bold transition-all duration-200 ease-out select-none cursor-pointer active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${variantClass} ${shapeClass} ${
        isIconOnly ? sizeConfig.iconOnly : sizeConfig.button
      } ${widthClass} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="loading loading-spinner loading-xs shrink-0" />
      ) : (
        <>
          {IconComponent &&
            (typeof IconComponent === "function" ||
            React.isValidElement(IconComponent) ? (
              <span
                className={`shrink-0 inline-flex items-center justify-center transition-transform duration-200 ease-out ${iconAnimation} ${
                  isIconOnly ? "" : sizeConfig.icon
                }`}
              >
                {React.isValidElement(IconComponent) ? (
                  IconComponent
                ) : (
                  <IconComponent className={sizeConfig.icon} />
                )}
              </span>
            ) : null)}

          {!isIconOnly && (
            <span className="truncate">
              {children !== undefined ? children : config.label}
            </span>
          )}

          {!isIconOnly &&
            iconPosition === "right" &&
            IconComponent &&
            (React.isValidElement(IconComponent) ? (
              <span className={`shrink-0 transition-transform duration-200 ease-out ${iconAnimation}`}>
                {IconComponent}
              </span>
            ) : (
              <span className={`shrink-0 transition-transform duration-200 ease-out ${iconAnimation}`}>
                <IconComponent className={sizeConfig.icon} />
              </span>
            ))}
        </>
      )}
    </button>
  );
};

// Convenience Compound Subcomponents
ActionButton.Add = (props) => <ActionButton action="add" {...props} />;
ActionButton.Cancel = (props) => <ActionButton action="cancel" {...props} />;
ActionButton.Close = (props) => (
  <ActionButton action="close" iconOnly shape="circle" {...props} />
);
ActionButton.Delete = (props) => <ActionButton action="delete" {...props} />;
ActionButton.Edit = (props) => <ActionButton action="edit" {...props} />;
ActionButton.View = (props) => <ActionButton action="view" {...props} />;
ActionButton.Save = (props) => <ActionButton action="save" {...props} />;
ActionButton.Confirm = (props) => <ActionButton action="confirm" {...props} />;
ActionButton.Refresh = (props) => <ActionButton action="refresh" {...props} />;

export default ActionButton;
