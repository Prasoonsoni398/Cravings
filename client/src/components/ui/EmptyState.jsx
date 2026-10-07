import React from "react";
import Button from "./Button";

export const EmptyState = ({
  icon,
  title = "No data found",
  message = "There are no records to display at this moment.",
  actionLabel,
  onAction,
  className = "",
}) => {
  return (
    <div
      className={`rounded-2xl border border-dashed border-base-300 bg-base-100/50 p-12 text-center flex flex-col items-center justify-center ${className}`}
    >
      {icon && (
        <div className="p-4 rounded-2xl bg-primary/10 text-primary text-3xl mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-base font-extrabold text-base-content">{title}</h3>
      <p className="text-xs text-base-content/60 mt-1 max-w-sm leading-relaxed">
        {message}
      </p>
      {actionLabel && onAction && (
        <Button
          variant="primary"
          size="sm"
          onClick={onAction}
          className="mt-4"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
