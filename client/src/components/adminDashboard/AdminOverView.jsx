import React, { useEffect, useState } from "react";
import api from "../../config/ApiConfig";
import { useAuth } from "../../context/AuthContext.jsx";
import { useSocket } from "../../context/SocketContext.jsx";
import {
  FiDollarSign,
  FiShoppingBag,
  FiUsers,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiTrendingUp,
} from "react-icons/fi";
import { FaStore } from "react-icons/fa";
import toast from "react-hot-toast";

const AdminOverView = () => {
  const { user } = useAuth();
  const { socket, joinRoom } = useSocket();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/stats");
      if (res.data?.success) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error("Failed to load admin stats:", error);
      toast.error("Failed to load platform statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    joinRoom("admin");

    if (socket) {
      socket.on("order:created", () => {
        fetchStats();
      });
      socket.on("order:status_updated", () => {
        fetchStats();
      });
      return () => {
        socket.off("order:created");
        socket.off("order:status_updated");
      };
    }
  }, [socket]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const kpiCards = [
    {
      title: "Platform Revenue",
      value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`,
      subtitle: "Gross merchandise value",
      icon: <FiDollarSign className="text-2xl text-emerald-600" />,
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      subtitle: `${stats?.ordersByStatus?.delivered || 0} Delivered`,
      icon: <FiShoppingBag className="text-2xl text-primary" />,
      bg: "bg-primary/10 border-primary/20",
    },
    {
      title: "Active Restaurants",
      value: `${stats?.activeRestaurants || 0} / ${stats?.totalRestaurants || 0}`,
      subtitle: "Approved & operational",
      icon: <FaStore className="text-2xl text-amber-500" />,
      bg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Fleet Riders",
      value: `${stats?.activeRiders || 0} / ${stats?.totalRiders || 0}`,
      subtitle: "Active delivery partners",
      icon: <FiTruck className="text-2xl text-indigo-500" />,
      bg: "bg-indigo-500/10 border-indigo-500/20",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-primary to-orange-500 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="badge badge-sm bg-white/20 text-white border-0 font-medium">
              ADMIN CONTROL CENTER
            </span>
            <h1 className="mt-2 text-2xl font-black md:text-3xl">
              Platform Overview & Health
            </h1>
            <p className="text-sm text-white/90">
              Welcome, {user?.fullName || "Administrator"}. Live telemetry across all restaurants, orders, and delivery riders.
            </p>
          </div>
          <button
            onClick={fetchStats}
            className="btn btn-sm bg-white text-primary border-0 hover:bg-white/90 rounded-xl font-bold self-start md:self-auto cursor-pointer"
          >
            Refresh Telemetry
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card, idx) => (
          <div
            key={idx}
            className={`rounded-2xl border p-5 shadow-sm transition hover:shadow-md ${card.bg}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-base-content/70">
                {card.title}
              </span>
              <div className="rounded-xl bg-base-100 p-3 shadow-xs">
                {card.icon}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-extrabold text-base-content">
                {card.value}
              </h3>
              <p className="mt-1 text-xs text-base-content/60">
                {card.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Order Status Breakdown Grid */}
      <div className="rounded-2xl border border-base-200 bg-base-100 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-base-content mb-4 flex items-center gap-2">
          <FiTrendingUp className="text-primary" /> Live Order Pipeline Status
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-3 text-center">
            <span className="text-xs font-semibold text-blue-600">Placed</span>
            <p className="text-2xl font-bold text-blue-700 mt-1">
              {(stats?.ordersByStatus?.placed || 0) + (stats?.ordersByStatus?.pending || 0)}
            </p>
          </div>
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-center">
            <span className="text-xs font-semibold text-amber-600">Preparing</span>
            <p className="text-2xl font-bold text-amber-700 mt-1">
              {(stats?.ordersByStatus?.preparing || 0) + (stats?.ordersByStatus?.restaurant_accepted || 0)}
            </p>
          </div>
          <div className="rounded-xl bg-purple-500/10 border border-purple-500/20 p-3 text-center">
            <span className="text-xs font-semibold text-purple-600">Ready / Rider</span>
            <p className="text-2xl font-bold text-purple-700 mt-1">
              {(stats?.ordersByStatus?.ready_for_pickup || 0) + (stats?.ordersByStatus?.rider_assigned || 0)}
            </p>
          </div>
          <div className="rounded-xl bg-cyan-500/10 border border-cyan-500/20 p-3 text-center">
            <span className="text-xs font-semibold text-cyan-600">Out for Delivery</span>
            <p className="text-2xl font-bold text-cyan-700 mt-1">
              {(stats?.ordersByStatus?.out_for_delivery || 0) + (stats?.ordersByStatus?.picked_up || 0)}
            </p>
          </div>
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-center">
            <span className="text-xs font-semibold text-emerald-600">Delivered</span>
            <p className="text-2xl font-bold text-emerald-700 mt-1">
              {stats?.ordersByStatus?.delivered || 0}
            </p>
          </div>
          <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-center">
            <span className="text-xs font-semibold text-rose-600">Cancelled/Failed</span>
            <p className="text-2xl font-bold text-rose-700 mt-1">
              {(stats?.ordersByStatus?.cancelled || 0) + (stats?.ordersByStatus?.rejected || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Orders Stream */}
      <div className="rounded-2xl border border-base-200 bg-base-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-base-content">
            Recent Platform Orders
          </h2>
          <span className="text-xs font-semibold text-base-content/60">
            Last 10 orders live feed
          </span>
        </div>

        {!stats?.recentOrders?.length ? (
          <p className="text-center py-6 text-sm text-base-content/60">
            No orders placed yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-sm w-full">
              <thead>
                <tr className="border-b border-base-200 text-xs font-bold text-base-content/60 uppercase">
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Restaurant</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Placed At</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-base-200/50">
                    <td className="font-mono text-xs font-bold text-primary">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="font-medium text-base-content">
                      {order.customerId?.fullName || "Guest Customer"}
                    </td>
                    <td className="text-base-content/80">
                      {order.restaurantId?.restaurantName || "Restaurant"}
                    </td>
                    <td className="font-bold text-base-content">
                      ₹{order.billDetails?.finalAmount || 0}
                    </td>
                    <td>
                      <span
                        className={`badge badge-sm font-semibold capitalize ${
                          order.orderStatus === "delivered"
                            ? "badge-success text-white"
                            : order.orderStatus === "cancelled" || order.orderStatus === "rejected"
                            ? "badge-error text-white"
                            : "badge-warning"
                        }`}
                      >
                        {order.orderStatus.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="text-xs text-base-content/60">
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOverView;
