import React from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import RiderSidebar from "../../components/riderDashboard/RiderSidebar.jsx";
import RiderOverview from "../../components/riderDashboard/RiderOverview.jsx";
import RiderOrder from "../../components/riderDashboard/RiderOrder.jsx";
import RiderSetting from "../../components/riderDashboard/RiderSetting.jsx";
import { useNavigate, useLocation } from "react-router-dom";

const RiderDashboard = () => {
  const { isLogin, role } = useAuth();
  const navigate = useNavigate();
  const active = useLocation().state?.activeTab;
  const [activeTab, setActiveTab] = React.useState(active || "overview");
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

  if (!isLogin || role !== "rider") {
    return (
      <div className="h-[92vh] bg-[url('/foodTable.webp')]  bg-cover bg-center">
        <div className="h-full backdrop-blur-lg flex flex-col items-center justify-center ">
          <h1 className="text-2xl font-bold text-(--color-neutral-content)">
            Access Denied. Please log in as a Rider to view this page.
          </h1>
          <button
            className="mt-4 px-4 py-2 bg-(--color-primary) text-white rounded-md"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

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
          <RiderSidebar activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setIsMobileMenuOpen(false); }} isCollapsed={isMobileMenuOpen ? false : isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
        </div>
        <div className="flex-1 bg-(--color-base-100) p-4 rounded-lg shadow-md h-full overflow-y-auto">
          {/* Hamburger Menu for Mobile */}
          <div className="md:hidden flex items-center mb-4 pb-2 border-b border-base-200">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 bg-base-200 rounded-md text-primary mr-3">
               <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="24px" width="24px" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>
            </button>
            <span className="font-semibold text-primary capitalize">{activeTab} Dashboard</span>
          </div>

          {activeTab === "overview" && <RiderOverview />}
          {activeTab === "orders" && <RiderOrder />}
          {activeTab === "settings" && <RiderSetting />}
        </div>
      </div>
    </>
  );
};

export default RiderDashboard;
