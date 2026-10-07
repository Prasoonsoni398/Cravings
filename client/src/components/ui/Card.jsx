import React from "react";

export const Card = ({
  children,
  title,
  subtitle,
  badge,
  action,
  icon,
  className = "",
  bodyClassName = "",
  hoverEffect = true,
  onClick,
}) => {
  const hoverClasses = hoverEffect
    ? "transition-all duration-300 hover:shadow-md hover:border-primary/30"
    : "";

  return (
    <div
      onClick={onClick}
      className={`card rounded-2xl border border-base-200 bg-base-100 shadow-sm overflow-hidden ${hoverClasses} ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {(title || subtitle || badge || action || icon) && (
        <div className="flex items-start justify-between p-5 pb-0 gap-3">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary text-xl shrink-0">
                {icon}
              </div>
            )}
            <div>
              {badge && <div className="mb-1">{badge}</div>}
              {title && (
                <h3 className="font-extrabold text-base text-base-content">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-base-content/60 mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={`p-5 ${bodyClassName}`}>{children}</div>
    </div>
  );
};

export default Card;
