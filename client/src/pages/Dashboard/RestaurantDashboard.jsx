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
      <div className="h-[91vh] flex gap-2 ">
        <div className="w-55 bg-(--color-base-200)  rounded-lg shadow-md h-full">
          <RestaurantSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="w-14/17 bg-(--color-base-100) p-4 rounded-lg shadow-md h-full">
          {activeTab === "overview" && <RestaurantOverview />}
          {activeTab === "orders" && <RestaurantOrders />}
          {activeTab === "setting" && <RestaurantSetting />}
        </div>
      </div>
    </>
  );
};

export default RestaurantDashboard;
