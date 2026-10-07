import React, { useEffect, useState } from "react";
import api from "../../config/ApiConfig";
import { useAuth } from "../../context/AuthContext.jsx";
import { useSocket } from "../../context/SocketContext.jsx";
import { Link } from "react-router-dom";
import {
  FiShoppingBag,
  FiClock,
  FiMapPin,
  FiHeart,
  FiTruck,
  FiArrowRight,
  FiCheckCircle,
} from "react-icons/fi";

const PROGRESS_STEPS = [
  { key: "placed", label: "Placed" },
  { key: "restaurant_accepted", label: "Accepted" },
  { key: "preparing", label: "Preparing" },
  { key: "ready_for_pickup", label: "Ready" },
  { key: "out_for_delivery", label: "On the Way" },
  { key: "delivered", label: "Delivered" },
];

const getStepIndex = (status) => {
  if (status === "placed" || status === "pending") return 0;
  if (status === "restaurant_accepted" || status === "accepted") return 1;
  if (status === "preparing") return 2;
  if (status === "ready_for_pickup" || status === "ready" || status === "rider_assigned" || status === "rider_arrived") return 3;
  if (status === "picked_up" || status === "pickedUp" || status === "out_for_delivery" || status === "outForDelivery" || status === "onTheWay") return 4;
  if (status === "delivered") return 5;
  return -1;
};

const UserOverView = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const { socket, joinRoom } = useSocket();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/my");
      if (res.data?.data) {
        setOrders(res.data.data);
      }
    } catch (error) {
      console.error("Failed to load user orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    if (user?._id) {
      joinRoom(`user:${user._id}`);
    }

    if (socket) {
      socket.on("order:status_updated", (updated) => {
        setOrders((prev) =>
          prev.map((o) => (o._id === updated._id ? { ...o, ...updated } : o))
        );
      });
      return () => {
        socket.off("order:status_updated");
      };
    }
  }, [socket, user]);

  const activeOrder = orders.find((o) =>
    ["placed", "pending", "restaurant_accepted", "preparing", "ready_for_pickup", "rider_assigned", "picked_up", "out_for_delivery"].includes(
      o.orderStatus
    )
  );

  const activeStepIdx = activeOrder ? getStepIndex(activeOrder.orderStatus) : -1;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-primary to-orange-500 p-6 text-white shadow-lg">
        <span className="badge badge-sm bg-white/20 text-white border-0 font-bold uppercase">
          Welcome back
        </span>
        <h1 className="mt-2 text-2xl font-black md:text-3xl">
          Hi, {user?.fullName || "Foodie"}!
        </h1>
        <p className="text-sm text-white/90 mt-1 max-w-xl">
          Track active food orders in real-time, view past orders, and manage saved delivery addresses.
        </p>
      </div>

      {/* Active Order Live Tracker Card */}
      {activeOrder && (
        <div className="rounded-2xl border-2 border-primary bg-primary/5 p-6 shadow-md">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-primary/20 pb-4">
            <div>
              <span className="badge badge-primary text-white font-black text-xs uppercase animate-pulse">
                Live Order in Progress
              </span>
              <h2 className="text-xl font-black text-base-content mt-1">
                {activeOrder.restaurantId?.restaurantName || "Restaurant"}
              </h2>
              <p className="text-xs text-base-content/60">
                Order #{activeOrder._id.slice(-6).toUpperCase()} • ₹{activeOrder.billDetails?.finalAmount}
              </p>
            </div>
            <button
              onClick={() => onNavigateTab && onNavigateTab("order")}
              className="btn btn-sm btn-primary text-white rounded-xl gap-2 font-bold cursor-pointer"
            >
              View Full Live Tracker <FiArrowRight />
            </button>
          </div>

          {/* Stepper Progress */}
          <div className="mt-6">
            <div className="grid grid-cols-6 gap-2 text-center">
              {PROGRESS_STEPS.map((step, idx) => {
                const isPassed = idx <= activeStepIdx;
                const isCurrent = idx === activeStepIdx;
                return (
                  <div key={step.key} className="flex flex-col items-center">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isCurrent
                          ? "bg-primary text-white ring-4 ring-primary/20 animate-bounce"
                          : isPassed
                          ? "bg-emerald-500 text-white"
                          : "bg-base-300 text-base-content/50"
                      }`}
                    >
                      {isPassed ? <FiCheckCircle /> : idx + 1}
                    </div>
                    <span
                      className={`mt-2 text-[11px] font-semibold hidden sm:block ${
                        isCurrent
                          ? "text-primary font-bold"
                          : isPassed
                          ? "text-base-content font-medium"
                          : "text-base-content/40"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-base-content/70 uppercase">
              Total Orders
            </span>
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary text-lg">
              <FiShoppingBag />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-base-content mt-3">
            {orders.length}
          </h3>
          <p className="text-xs text-base-content/60 mt-1">Orders placed to date</p>
        </div>

        <div className="rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-base-content/70 uppercase">
              Delivered Meals
            </span>
            <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-500 text-lg">
              <FiCheckCircle />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-base-content mt-3">
            {orders.filter((o) => o.orderStatus === "delivered").length}
          </h3>
          <p className="text-xs text-base-content/60 mt-1">Successfully fulfilled</p>
        </div>

        <div className="rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-base-content/70 uppercase">
              Quick Re-order
            </span>
            <div className="p-2.5 bg-orange-500/10 rounded-xl text-orange-500 text-lg">
              <FiClock />
            </div>
          </div>
          <Link
            to="/"
            className="btn btn-xs btn-primary text-white rounded-lg mt-4 font-bold inline-flex items-center gap-1"
          >
            Explore Restaurants <FiArrowRight />
          </Link>
        </div>
      </div>

      {/* Recent Orders Stream */}
      <div className="rounded-2xl border border-base-200 bg-base-100 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-base-content mb-4">
          Recent Orders History
        </h2>
        {!orders.length ? (
          <p className="text-sm text-base-content/60 py-6 text-center">
            You haven't placed any orders yet. Discover delicious foods!
          </p>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order._id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-base-200/80 hover:bg-base-200/30 transition text-xs"
              >
                <div>
                  <h4 className="font-bold text-sm text-base-content">
                    {order.restaurantId?.restaurantName || "Restaurant"}
                  </h4>
                  <p className="text-base-content/60 mt-0.5">
                    {order.orderItems?.length || 0} items • Ordered on{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-black text-sm text-base-content block">
                    ₹{order.billDetails?.finalAmount}
                  </span>
                  <span
                    className={`badge badge-xs font-bold uppercase mt-1 ${
                      order.orderStatus === "delivered"
                        ? "badge-success text-white"
                        : order.orderStatus === "cancelled"
                        ? "badge-error text-white"
                        : "badge-warning"
                    }`}
                  >
                    {order.orderStatus.replace(/_/g, " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOverView;
