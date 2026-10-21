import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBorderAll } from "react-icons/fa6";
import {
  MdOutlineDashboard,
  MdOutlineFavorite,
  MdSettingsSuggest,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdOutlineMenu,
} from "react-icons/md";
import { LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import toast from "react-hot-toast";
import { Modal, ActionButton } from "../ui";

const MenuItems = [
  { name: "Overview", path: "overview", icon: <MdOutlineDashboard /> },
  { name: "Kitchen Orders", path: "orders", icon: <FaBorderAll /> },
  { name: "Menu Items", path: "menu", icon: <MdOutlineMenu /> },
  { name: "Settings", path: "setting", icon: <MdSettingsSuggest /> },
];

const RestaurantSidebar = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
}) => {
  const navigate = useNavigate();
  const currentPath = activeTab || "overview";
  const { setUser, setIsLogin } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleNavigation = (path) => {
    setActiveTab(path);
    navigate(`/restaurant-dashboard/${path}`);
  };

  const handleConfirmLogout = async () => {
    try {
      setIsLoggingOut(true);
      await fetch("/api/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout request error:", err);
    } finally {
      setIsLogin(false);
      sessionStorage.removeItem("UserData");
      sessionStorage.removeItem("cravingUser");
      localStorage.removeItem("token");
      setUser(null);
      setIsLoggingOut(false);
      setShowLogoutModal(false);
      toast.success("Logged out successfully");
      navigate("/login");
    }
  };

  return (
    <>
      <div
        className={`w-full border-r border-base-300 bg-base-200 shadow-md h-[91vh] transition-all duration-300 ${
          isCollapsed ? "max-w-20" : "max-w-72"
        } flex flex-col justify-between`}
      >
        <div>
          <div className="border-b border-primary/30 text-primary font-bold p-3 flex items-center justify-between">
            {!isCollapsed && (
              <span className="text-lg font-black transition-all duration-500">
                Restaurant Portal
              </span>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="ml-auto rounded-full p-2 hover:bg-primary/10 text-primary cursor-pointer"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <MdKeyboardDoubleArrowRight />
              ) : (
                <MdKeyboardDoubleArrowLeft />
              )}
            </button>
          </div>
          <div className="p-2.5 flex flex-col gap-1.5 overflow-y-auto max-h-[75vh]">
            {MenuItems.map((item, idx) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={idx}
                  onClick={() => handleNavigation(item.path)}
                  className={`group relative flex items-center w-full gap-3 text-xs md:text-sm font-bold p-3 rounded-2xl transition-all duration-200 cursor-pointer active:scale-95 ${
                    isActive
                      ? "bg-primary text-white shadow-md shadow-primary/25 translate-x-1"
                      : "text-base-content/70 hover:bg-primary/10 hover:text-primary hover:translate-x-1"
                  } ${isCollapsed ? "justify-center" : "justify-start"}`}
                  title={item.name}
                >
                  <span
                    className={`text-xl transition-transform duration-200 ${
                      isActive ? "scale-110" : "group-hover:scale-115"
                    }`}
                  >
                    {item.icon}
                  </span>
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                  {isActive && !isCollapsed && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-white shadow-xs" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer Logout Button */}
        <div className="p-2.5 border-t border-base-300">
          <button
            onClick={() => setShowLogoutModal(true)}
            className={`group flex items-center w-full gap-3 text-xs md:text-sm font-bold p-3 rounded-2xl text-rose-600 hover:bg-rose-50 hover:text-rose-700 active:scale-95 transition-all duration-200 cursor-pointer ${
              isCollapsed ? "justify-center" : "justify-start"
            }`}
            title="Log Out"
          >
            <LogOut className="w-5 h-5 shrink-0 transition-transform group-hover:scale-115 group-hover:-translate-x-0.5" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <Modal
          isOpen={showLogoutModal}
          onClose={() => !isLoggingOut && setShowLogoutModal(false)}
          title="Confirm Sign Out"
          maxWidth="max-w-sm"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl text-xl shrink-0 mt-0.5 shadow-xs">
                <LogOut className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-base-content">
                  Are you sure you want to log out?
                </h4>
                <p className="text-xs text-base-content/60 mt-1 leading-relaxed">
                  You will need to sign in again to receive kitchen orders and manage menu dishes.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-base-200">
              <ActionButton.Cancel
                size="sm"
                onClick={() => setShowLogoutModal(false)}
                disabled={isLoggingOut}
              />
              <ActionButton.Delete
                size="sm"
                icon={<LogOut className="w-3.5 h-3.5" />}
                onClick={handleConfirmLogout}
                loading={isLoggingOut}
              >
                Yes, Sign Out
              </ActionButton.Delete>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default RestaurantSidebar;
