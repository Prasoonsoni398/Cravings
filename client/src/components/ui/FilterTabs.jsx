import React from "react";

export const FilterTabs = ({
  tabs = [],
  activeTab,
  onSelectTab,
  size = "xs",
  className = "",
}) => {
  const sizeClasses = size === "xs" ? "text-xs py-1.5 px-3" : "text-sm py-2 px-4";

  return (
    <div className={`flex flex-wrap items-center gap-1.5 p-1 bg-base-200/60 rounded-2xl ${className}`}>
      {tabs.map((tab) => {
        const id = typeof tab === "object" ? tab.id : tab;
        const label = typeof tab === "object" ? tab.label : tab;
        const count = typeof tab === "object" ? tab.count : undefined;
        const icon = typeof tab === "object" ? tab.icon : null;
        const isActive = activeTab === id;

        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelectTab(id)}
            className={`rounded-xl font-bold transition-all duration-200 capitalize flex items-center gap-1.5 cursor-pointer ${sizeClasses} ${
              isActive
                ? "bg-primary text-white shadow-sm scale-[1.02]"
                : "text-base-content/70 hover:text-base-content hover:bg-base-100"
            }`}
          >
            {icon && <span className="text-sm">{icon}</span>}
            <span>{label.replace(/_/g, " ")}</span>
            {typeof count !== "undefined" && (
              <span
                className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  isActive ? "bg-white/20 text-white" : "bg-base-300 text-base-content/80"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default FilterTabs;
