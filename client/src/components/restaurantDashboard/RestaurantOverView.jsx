import React, { useEffect, useState } from "react";
import api from "../../config/ApiConfig";
import { useAuth } from "../../context/AuthContext.jsx";
import { useSocket } from "../../context/SocketContext.jsx";
import {
  FiDollarSign,
  FiShoppingBag,
  FiClock,
  FiStar,
  FiCheckCircle,
  FiBookOpen,
  FiSettings,
  FiPower,
} from "react-icons/fi";
import { FaStore } from "react-icons/fa";
import toast from "react-hot-toast";

const RestaurantOverView = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const { socket, joinRoom } = useSocket();
  const [restaurant, setRestaurant] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [togglingOpen, setTogglingOpen] = useState(false);

  const fetchRestaurantData = async () => {
    try {
      const [restRes, analyticsRes] = await Promise.all([
        api.get(`/restaurant/get-restaurant-data?id=${user?._id}`),
        api.get("/restaurant/analytics"),
      ]);

      if (restRes.data?.data) {
        setRestaurant(restRes.data.data);
      }
      if (analyticsRes.data?.data) {
        setAnalytics(analyticsRes.data.data);
      }
    } catch (error) {
      console.error("Failed to load restaurant dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchRestaurantData();
    }
  }, [user]);

  useEffect(() => {
    if (restaurant?._id) {
      joinRoom(`restaurant:${restaurant._id}`);
    }

    if (socket) {
      socket.on("order:created", () => {
        toast("New order received for kitchen!", { icon: "🔔" });
        fetchRestaurantData();
      });
      socket.on("order:status_updated", () => {
        fetchRestaurantData();
      });
      return () => {
        socket.off("order:created");
        socket.off("order:status_updated");
      };
    }
  }, [socket, restaurant]);

  const handleToggleOpenStatus = async () => {
    if (!restaurant) return;
    try {
      setTogglingOpen(true);
      const nextStatus = !restaurant.isOpen;
      const res = await api.patch(`/restaurant/change-open-status/${nextStatus}`);
      if (res.status === 200) {
        setRestaurant((prev) => ({ ...prev, isOpen: nextStatus }));
        toast.success(
          `Restaurant is now ${nextStatus ? "OPEN for orders" : "CLOSED"}`
        );
      }
    } catch (error) {
      toast.error("Failed to toggle open status");
    } finally {
      setTogglingOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const kpis = [
    {
      label: "Kitchen Sales",
      value: `₹${(analytics?.totalRevenue || 0).toLocaleString()}`,
      sub: "Total completed sales",
      icon: <FiDollarSign className="text-emerald-500" />,
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "Live Active Orders",
      value: analytics?.liveOrders || 0,
      sub: "Needs preparation / pickup",
      icon: <FiClock className="text-amber-500" />,
      bg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      label: "Total Orders Served",
      value: analytics?.totalOrders || 0,
      sub: `${analytics?.completedOrders || 0} successfully delivered`,
      icon: <FiShoppingBag className="text-primary" />,
      bg: "bg-primary/10 border-primary/20",
    },
    {
      label: "Customer Rating",
      value: `${analytics?.rating || restaurant?.averageRating || 4.5} ★`,
      sub: "Based on customer reviews",
      icon: <FiStar className="text-yellow-500" />,
      bg: "bg-yellow-500/10 border-yellow-500/20",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Restaurant Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-primary to-orange-600 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="badge badge-sm bg-white/20 text-white border-0 font-semibold uppercase">
              Restaurant Manager Panel
            </span>
            <h1 className="mt-2 text-2xl font-black md:text-3xl">
              {restaurant?.restaurantName || "My Restaurant"}
            </h1>
            <p className="text-sm text-white/90 mt-1">
              {restaurant?.address || "City Center"}, {restaurant?.city || "Bhopal"} • Cuisines: {restaurant?.cuisineTypes?.join(", ") || "Multi-Cuisine"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleOpenStatus}
              disabled={togglingOpen}
              className={`btn btn-sm rounded-xl font-bold border-0 shadow-md flex items-center gap-2 cursor-pointer ${
                restaurant?.isOpen
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                  : "bg-rose-600 hover:bg-rose-700 text-white"
              }`}
            >
              <FiPower />
              {togglingOpen
                ? "Updating..."
                : restaurant?.isOpen
                ? "Store is ONLINE"
                : "Store is OFFLINE"}
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k, idx) => (
          <div
            key={idx}
            className={`rounded-2xl border p-5 shadow-sm transition hover:shadow-md ${k.bg}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-base-content/70 uppercase">
                {k.label}
              </span>
              <div className="rounded-xl bg-base-100 p-2.5 text-xl shadow-xs">
                {k.icon}
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-3xl font-extrabold text-base-content">
                {k.value}
              </h3>
              <p className="mt-1 text-xs text-base-content/60">{k.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Kitchen Action Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div
          onClick={() => onNavigateTab && onNavigateTab("orders")}
          className="rounded-2xl border border-base-200 bg-base-100 p-6 shadow-sm hover:border-primary transition cursor-pointer flex items-center gap-4"
        >
          <div className="p-4 bg-primary/10 rounded-2xl text-primary text-2xl">
            <FiShoppingBag />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-base-content">
              Live Kitchen Orders
            </h3>
            <p className="text-xs text-base-content/60 mt-0.5">
              Accept orders, update food prep status & assign riders.
            </p>
          </div>
        </div>

        <div
          onClick={() => onNavigateTab && onNavigateTab("menu")}
          className="rounded-2xl border border-base-200 bg-base-100 p-6 shadow-sm hover:border-primary transition cursor-pointer flex items-center gap-4"
        >
          <div className="p-4 bg-orange-500/10 rounded-2xl text-orange-500 text-2xl">
            <FiBookOpen />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-base-content">
              Menu & Catalog
            </h3>
            <p className="text-xs text-base-content/60 mt-0.5">
              Add dishes, update pricing, veg/non-veg flags & stock.
            </p>
          </div>
        </div>

        <div
          onClick={() => onNavigateTab && onNavigateTab("setting")}
          className="rounded-2xl border border-base-200 bg-base-100 p-6 shadow-sm hover:border-primary transition cursor-pointer flex items-center gap-4"
        >
          <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-500 text-2xl">
            <FiSettings />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-base-content">
              Store Profile & Timings
            </h3>
            <p className="text-xs text-base-content/60 mt-0.5">
              Update cover photos, gallery, bank account & hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantOverView;
