import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Sidebar from "../../components/userDashboard/UserSidebar.jsx";
import Overview from "../../components/userDashboard/UserOverView.jsx";
import Orders from "../../components/userDashboard/UserOrder.jsx";
import UserAddresses from "../../components/userDashboard/UserAddresses.jsx";
import UserComplaints from "../../components/userDashboard/UserComplaints.jsx";
import Setting from "../../components/userDashboard/UserSetting.jsx";

const VALID_TABS = ["overview", "order", "addresses", "complaints", "setting"];

const UserDashboard = () => {
  const { isLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = React.useState(() => {
    const pathTab = location.pathname.split("/").filter(Boolean).pop();
    return VALID_TABS.includes(pathTab) ? pathTab : "overview";
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(
    window.innerWidth < 768
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsSidebarCollapsed(window.innerWidth < 768);
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    const pathTab = location.pathname.split("/").filter(Boolean).pop();
    if (VALID_TABS.includes(pathTab)) {
      setActiveTab(pathTab);
    }
  }, [location.pathname]);

  if (!isLogin) {
    return (
      <div className="h-[92vh] bg-[url('/foodTable.webp')] bg-cover bg-center">
        <div className="h-full backdrop-blur-lg flex flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-bold text-base-content bg-base-100/80 px-6 py-4 rounded-2xl shadow-lg text-center">
            Please log in to view your account dashboard.
          </h1>
          <button
            className="mt-4 px-6 py-2.5 bg-primary text-white rounded-xl font-bold shadow-md hover:bg-primary-focus cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[91vh] flex gap-2 relative bg-base-200 p-2 overflow-hidden">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`shrink-0 rounded-2xl shadow-sm bg-base-200 h-[91vh] transition-all duration-300 fixed md:sticky top-0 md:top-2 z-50 ${
          isMobileMenuOpen ? "left-0" : "-left-full md:left-0"
        } ${isSidebarCollapsed && !isMobileMenuOpen ? "w-20" : "w-[240px]"}`}
      >
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setIsMobileMenuOpen(false);
          }}
          isCollapsed={isMobileMenuOpen ? false : isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />
      </div>

      {/* Main Content Viewport */}
      <div className="flex-1 bg-base-100 p-4 md:p-6 rounded-2xl shadow-sm h-full overflow-y-auto">
        <div className="md:hidden flex items-center mb-4 pb-2 border-b border-base-200">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 bg-base-200 rounded-xl text-primary mr-3"
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 24 24"
              height="20px"
              width="20px"
            >
              <path fill="none" d="M0 0h24v24H0V0z"></path>
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
            </svg>
          </button>
          <span className="font-bold text-primary capitalize">
            {activeTab} Management
          </span>
        </div>

        {activeTab === "overview" && (
          <Overview onNavigateTab={(tab) => setActiveTab(tab)} />
        )}
        {activeTab === "order" && <Orders />}
        {activeTab === "addresses" && <UserAddresses />}
        {activeTab === "complaints" && <UserComplaints />}
        {activeTab === "setting" && <Setting />}
      </div>
    </div>
  );
};

export default UserDashboard;
