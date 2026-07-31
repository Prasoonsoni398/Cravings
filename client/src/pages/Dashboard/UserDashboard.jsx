import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Sidebar from "../../components/userDashboard/UserSidebar.jsx";
import Overview from "../../components/userDashboard/UserOverView.jsx";
import Orders from "../../components/userDashboard/UserOrder.jsx";
import Setting from "../../components/userDashboard/UserSetting.jsx";

const UserDashboard = () => {
  const { isLogin, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = React.useState(() => {
    const pathTab = location.pathname.split("/").filter(Boolean).pop();
    return ["overview", "order", "wishlist", "setting"].includes(pathTab)
      ? pathTab
      : "overview";
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(window.innerWidth < 768);
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
    if (["overview", "order", "wishlist", "setting"].includes(pathTab)) {
      setActiveTab(pathTab);
    }
  }, [location.pathname]);

  return (
    <>
      {/* create a sidebar and main content area */}
      <div className="h-[91vh] flex gap-2 relative">
        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
        )}

        <div
          className={`shrink-0 rounded-lg shadow-md bg-(--color-base-200) h-[91vh] transition-all duration-500 fixed md:sticky top-0 md:top-16 z-50 ${isMobileMenuOpen ? "left-0" : "-left-full md:left-0"} ${isSidebarCollapsed && !isMobileMenuOpen ? "w-20" : "w-[250px]"}`}
        >
          <Sidebar activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setIsMobileMenuOpen(false); }} isCollapsed={isMobileMenuOpen ? false : isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
        </div>
        <div className="flex-1 bg-(--color-base-100) p-4 rounded-lg shadow-md h-full overflow-y-auto">
          {/* Hamburger Menu for Mobile */}
          <div className="md:hidden flex items-center mb-4 pb-2 border-b border-base-200">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 bg-base-200 rounded-md text-primary mr-3">
               <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="24px" width="24px" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>
            </button>
            <span className="font-semibold text-primary capitalize">{activeTab} Dashboard</span>
          </div>

          {activeTab === "overview" && <Overview />}
          {activeTab === "order" && <Orders />}
          {activeTab === "setting" && <Setting />}
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
