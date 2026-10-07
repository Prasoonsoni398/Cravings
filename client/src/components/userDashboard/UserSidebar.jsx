import React, { useState } from "react";
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
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import toast from "react-hot-toast";
import { Modal, Button } from "../ui";

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
  const navigate = useNavigate();
  const { setUser, setIsLogin } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

        {/* Sidebar Footer Logout Button */}
        <div className="p-2 border-t border-base-300">
          <button
            onClick={() => setShowLogoutModal(true)}
            className={`flex items-center w-full gap-3 text-sm font-semibold p-2.5 rounded-xl text-error hover:bg-error/10 transition-all cursor-pointer ${
              isCollapsed ? "justify-center" : "justify-start"
            }`}
            title="Log Out"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span>Log Out</span>}
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
              <div className="p-3 bg-error/10 text-error rounded-2xl text-xl shrink-0 mt-0.5">
                <LogOut className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-base-content">
                  Are you sure you want to log out?
                </h4>
                <p className="text-xs text-base-content/60 mt-1 leading-relaxed">
                  You will need to sign in again to view your dashboard, manage cart items, or track orders.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-base-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLogoutModal(false)}
                disabled={isLoggingOut}
              >
                Cancel
              </Button>
              <Button
                variant="error"
                size="sm"
                icon={<LogOut className="w-3.5 h-3.5" />}
                onClick={handleConfirmLogout}
                loading={isLoggingOut}
              >
                Yes, Sign Out
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default UserSidebar;
