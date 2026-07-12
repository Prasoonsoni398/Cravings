import React from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import AdminSidebar from "../../components/adminDashboard/AdminSidebar";
import AdminSetting from "../../components/adminDashboard/AdminSetting";
import AdminOverview from "../../components/adminDashboard/AdminOverView";
import AdminOrders from "../../components/adminDashboard/AdminOrder.jsx";

const AdminDashboard = () => {
  const { isLogin, role } = useAuth();
  const navigate = useNavigate();
  const active = useLocation().state?.activeTab;
  const [activeTab, setActiveTab] = React.useState(active || "overview");

 if (!isLogin || role !== "admin") {
    return (
      <div className="h-[92vh] bg-[url('/foodTable.webp')]  bg-cover bg-center">
        <div className="h-full backdrop-blur-lg flex flex-col items-center justify-center ">
          <h1 className="text-2xl font-bold text-(--color-neutral-content)">
            Access Denied. Please log in as a Admin to view this page.
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
};

export default AdminDashboard;
