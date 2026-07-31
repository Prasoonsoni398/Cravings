import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaBorderAll } from "react-icons/fa6";
import {
  MdOutlineDashboard,
  MdOutlineFavorite,
  MdSettingsSuggest,
} from "react-icons/md";

import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";

const MenuItems = [
  { name: "Overview", path: "overview", icon: <MdOutlineDashboard /> },
  { name: "Order", path: "orders", icon: <FaBorderAll /> },
  { name: "Wishlist", path: "wishlist", icon: <MdOutlineFavorite /> },
  { name: "Setting", path: "settings", icon: <MdSettingsSuggest /> },
];

const AdminSidebar = ({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();
  const currentPath = activeTab || "overview";

  const handleNavigation = (path) => {
    setActiveTab(path);
    navigate(`/admin/dashboard/${path}`);
  };

  return (
    <div
      className={`w-full border-r border-base-300 bg-base-200 shadow-md h-[91vh] transition-all duration-300 ${isCollapsed ? "max-w-20" : "max-w-[250px]"}`}
    >
      <div className="border-b border-primary/30 text-primary font-bold p-3 flex items-center justify-between">
        {!isCollapsed && (
          <span className="text-xl transition-all duration-500">
            Admin Dashboard
          </span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto rounded-full p-2 hover:bg-primary/10 text-primary"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <MdKeyboardDoubleArrowRight />
          ) : (
            <MdKeyboardDoubleArrowLeft />
          )}
        </button>
      </div>
      <div className="p-2 flex flex-col gap-3 items-center">
        {MenuItems.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleNavigation(item.path)}
            className={`flex items-center justify-center hover:border-primary w-full gap-2 text-xl p-2 rounded-sm border transition-all ${currentPath === item.path && "bg-primary text-primary-content"} ${isCollapsed ? "justify-center" : "justify-start"}`}
          >
            {item.icon}
            {!isCollapsed && <span>{item.name}</span>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;
