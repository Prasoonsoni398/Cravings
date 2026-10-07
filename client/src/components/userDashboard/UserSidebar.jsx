import React from "react";
import { FaBorderAll } from "react-icons/fa6";
import {
  MdOutlineDashboard,
  MdSettingsSuggest,
  MdLocationOn,
  MdSupportAgent,
  MdRestaurantMenu,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";

const MenuItems = [
  { name: "Overview", path: "overview", icon: <MdOutlineDashboard /> },
  { name: "Browse Menu", path: "menu", icon: <MdRestaurantMenu /> },
  { name: "My Orders", path: "order", icon: <FaBorderAll /> },
  { name: "Saved Addresses", path: "addresses", icon: <MdLocationOn /> },
  { name: "Helpdesk", path: "complaints", icon: <MdSupportAgent /> },
  { name: "Settings", path: "setting", icon: <MdSettingsSuggest /> },
];

const UserSidebar = ({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) => {
  const currentPath = activeTab || "overview";

  return (
    <div
      className={`w-full border-r border-base-300 bg-base-200 shadow-md h-[91vh] transition-all duration-300 ${
        isCollapsed ? "max-w-20" : "max-w-[240px]"
      } flex flex-col justify-between`}
    >
      <div>
        <div className="border-b border-primary/30 text-primary font-bold p-3 flex items-center justify-between">
          {!isCollapsed && (
            <span className="text-lg font-black transition-all">My Cravings</span>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto rounded-full p-2 hover:bg-primary/10 text-primary cursor-pointer"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <MdKeyboardDoubleArrowRight /> : <MdKeyboardDoubleArrowLeft />}
          </button>
        </div>

        <div className="p-2 flex flex-col gap-1.5">
          {MenuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(item.path)}
              className={`flex items-center w-full gap-3 text-sm font-semibold p-2.5 rounded-xl border transition-all cursor-pointer ${
                currentPath === item.path
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "border-transparent hover:bg-base-300 text-base-content/80"
              } ${isCollapsed ? "justify-center" : "justify-start"}`}
              title={item.name}
            >
              <span className="text-xl">{item.icon}</span>
              {!isCollapsed && <span>{item.name}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;
