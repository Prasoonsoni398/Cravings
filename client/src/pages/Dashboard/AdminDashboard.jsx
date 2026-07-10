import React from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { Outlet, Navigate } from "react-router-dom";
import AdminSidebar from "../../components/adminDashboard/AdminSidebar.jsx";
import AdminSetting from "../../components/adminDashboard/AdminSetting";
import AdminOverview from "../../components/adminDashboard/AdminOverView.jsx";
import AdminOrders from "../../components/adminDashboard/AdminOrder.jsx";

const AdminDashboard = () => {
  const { isLogin, role } = useAuth();
  const navigate = useNavigate();
  const active = useLocation().state?.activeTab;
  const [activeTab, setActiveTab] = React.useState(active || "overview");

  if (!isLogin || role !== "admin") {
    return (
      <>
        <div className="h-[91vh] flex gap-2 p-2">
        <div className="w-3/17 bg-(--color-base-200) p-4 rounded-lg shadow-md h-full">
          <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="w-14/17 bg-(--color-base-100) p-4 rounded-lg shadow-md h-full">
          {activeTab === "overview" && <AdminOverview />}
          {activeTab === "orders" && <AdminOrders />}
          {activeTab === "settings" && <AdminSetting />}
        </div>
      </div>
      </>
    );
  }

  return (
    <>
      {/* create a sidebar and main content area */}
      <div className="flex h-full">
        <div className="w-1/6 border border-base-300">
          <Sidebar />
        </div>
        <div className="w-5/6 h-full border border-base-300 p-4">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
