import React from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import {  useNavigate,useLocation } from "react-router-dom";
import RestaurantSidebar from "../../components/restaurantDashboard/RestaurantSidebar.jsx";
import RestaurantOverview from "../../components/restaurantDashboard/RestaurantOverView.jsx"
import RestaurantOrders from "../../components/restaurantDashboard/RestaurantOrder.jsx"
import RestaurantSetting from "../../components/restaurantDashboard/RestaurantSetting.jsx"

const RestaurantDashboard = () => {
  const { isLogin, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = React.useState(() => {
    const pathTab = location.pathname.split('/').filter(Boolean).pop();
    return ['overview', 'orders', 'wishlist', 'setting'].includes(pathTab) ? pathTab : 'overview';
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  React.useEffect(() => {
    const pathTab = location.pathname.split('/').filter(Boolean).pop();
    if (['overview', 'orders', 'wishlist', 'setting'].includes(pathTab)) {
      setActiveTab(pathTab);
    }
  }, [location.pathname]);

  if (!isLogin || role !== "restaurant") {
    return (
      <div className="h-[92vh] bg-[url('/foodTable.webp')]  bg-cover bg-center">
        <div className="h-full backdrop-blur-lg flex flex-col items-center justify-center ">
          <h1 className="text-2xl font-bold text-(--color-neutral-content)">
            Access Denied. Please log in as a Restaurant Manager to view this
            page.
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
      <div className="flex gap-2">
        <div className={`shrink-0 rounded-lg shadow-md bg-(--color-base-200) h-full ${isSidebarCollapsed ? "w-20" : "w-72"}`}>
          <RestaurantSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
          />
        </div>
        <div className="flex-1 bg-(--color-base-100) rounded-lg h-full">
          {activeTab === "overview" && <RestaurantOverview />}
          {activeTab === "orders" && <RestaurantOrders />}
          {activeTab === "setting" && <RestaurantSetting />}
        </div>
      </div>
    </>
  );
};

export default RestaurantDashboard;
