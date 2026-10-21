import React, { useEffect, useState, useMemo } from "react";
import api from "../../config/ApiConfig";
import { useAuth } from "../../context/AuthContext.jsx";
import { useSocket } from "../../context/SocketContext.jsx";
import { Link } from "react-router-dom";
import {
  FiShoppingBag,
  FiClock,
  FiMapPin,
  FiTruck,
  FiArrowRight,
  FiCheckCircle,
  FiCompass,
  FiHelpCircle,
  FiPackage,
  FiSearch,
  FiAlertCircle,
} from "react-icons/fi";
import { Button, ActionButton, Badge, Card, EmptyState, LoadingSpinner } from "../ui";

const PROGRESS_STEPS = [
  { key: "placed", label: "Placed", desc: "Order received by restaurant" },
  { key: "restaurant_accepted", label: "Accepted", desc: "Kitchen confirmed the ticket" },
  { key: "preparing", label: "Preparing", desc: "Chef is cooking your dish" },
  { key: "ready_for_pickup", label: "Ready", desc: "Packaged & waiting for rider" },
  { key: "out_for_delivery", label: "On the Way", desc: "Rider is heading to your doorstep" },
  { key: "delivered", label: "Delivered", desc: "Enjoy your delicious meal!" },
];

const getStepIndex = (status) => {
  if (status === "placed" || status === "pending") return 0;
  if (status === "restaurant_accepted" || status === "accepted") return 1;
  if (status === "preparing") return 2;
  if (
    status === "ready_for_pickup" ||
    status === "ready" ||
    status === "rider_assigned" ||
    status === "rider_arrived"
  )
    return 3;
  if (
    status === "picked_up" ||
    status === "pickedUp" ||
    status === "out_for_delivery" ||
    status === "outForDelivery" ||
    status === "onTheWay"
  )
    return 4;
  if (status === "delivered") return 5;
  return -1;
};

const getTimeGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return { text: "Good Morning", emoji: "☀️" };
  if (hour < 17) return { text: "Good Afternoon", emoji: "🌤️" };
  return { text: "Good Evening", emoji: "🌙" };
};

const UserOverView = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const { socket, joinRoom } = useSocket();
  const [orders, setOrders] = useState([]);
  const [addressesCount, setAddressesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeStepHover, setActiveStepHover] = useState(null);
  const [orderFilter, setOrderFilter] = useState("all");
  const [orderSearch, setOrderSearch] = useState("");

  const fetchData = async (showRefreshSpinner = false) => {
    try {
      if (showRefreshSpinner) setIsRefreshing(true);
      else setLoading(true);

      const [ordersRes, addressRes] = await Promise.allSettled([
        api.get("/orders/my"),
        api.get("/customer/addresses"),
      ]);

      if (ordersRes.status === "fulfilled" && ordersRes.value?.data?.data) {
        setOrders(ordersRes.value.data.data);
      }
      if (addressRes.status === "fulfilled" && addressRes.value?.data?.data) {
        setAddressesCount(addressRes.value.data.data.length);
      }
    } catch (error) {
      console.error("Failed to load user overview data:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    if (user?._id) {
      joinRoom(`user:${user._id}`);
    }

    if (socket) {
      const handleStatusUpdate = (updated) => {
        setOrders((prev) =>
          prev.map((o) => (o._id === updated._id ? { ...o, ...updated } : o))
        );
      };
      socket.on("order:status_updated", handleStatusUpdate);
      return () => {
        socket.off("order:status_updated", handleStatusUpdate);
      };
    }
  }, [socket, user]);

  const activeOrder = useMemo(() => {
    return orders.find((o) =>
      [
        "placed",
        "pending",
        "restaurant_accepted",
        "preparing",
        "ready_for_pickup",
        "rider_assigned",
        "picked_up",
        "out_for_delivery",
      ].includes(o.orderStatus)
    );
  }, [orders]);

  const activeStepIdx = activeOrder ? getStepIndex(activeOrder.orderStatus) : -1;

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        !orderSearch ||
        (order.restaurantId?.restaurantName || "")
          .toLowerCase()
          .includes(orderSearch.toLowerCase()) ||
        order._id.toLowerCase().includes(orderSearch.toLowerCase());

      if (!matchesSearch) return false;

      if (orderFilter === "active") {
        return [
          "placed",
          "pending",
          "restaurant_accepted",
          "preparing",
          "ready_for_pickup",
          "rider_assigned",
          "picked_up",
          "out_for_delivery",
        ].includes(orderStatus(order.orderStatus));
      }
      if (orderFilter === "delivered") {
        return order.orderStatus === "delivered";
      }
      if (orderFilter === "cancelled") {
        return order.orderStatus === "cancelled";
      }
      return true;
    });
  }, [orders, orderFilter, orderSearch]);

  function orderStatus(status) {
    return status;
  }

  const deliveredCount = useMemo(
    () => orders.filter((o) => o.orderStatus === "delivered").length,
    [orders]
  );

  const greeting = getTimeGreeting();
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="lg" label="Loading customer dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Interactive Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-primary via-orange-500 to-amber-500 p-6 md:p-8 text-white shadow-xl">
        {/* Decorative background glow circles */}
        <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-32 -bottom-16 h-48 w-48 rounded-full bg-black/10 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white tracking-wide uppercase">
                <span>{greeting.emoji}</span> {greeting.text}
              </span>
              <span className="text-xs text-white/80 font-medium">
                • {currentDate}
              </span>
            </div>

            <h1 className="mt-2 text-2xl md:text-3xl font-black tracking-tight text-white">
              Welcome back, {user?.fullName || "Foodie"}!
            </h1>
            <p className="mt-1 text-xs md:text-sm text-white/90 max-w-xl leading-relaxed">
              Real-time kitchen orders, instant delivery status updates, and quick reorders at your fingertips.
            </p>

            {/* Interactive Quick-Jump Pills */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigateTab && onNavigateTab("menu")}
                className="px-3 py-1.5 rounded-xl bg-white text-primary text-xs font-extrabold shadow-sm hover:bg-white/90 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <FiCompass /> Browse Food
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab && onNavigateTab("order")}
                className="px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-sm text-white text-xs font-bold hover:bg-white/30 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <FiPackage /> Orders ({orders.length})
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab && onNavigateTab("addresses")}
                className="px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-sm text-white text-xs font-bold hover:bg-white/30 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <FiMapPin /> Addresses ({addressesCount})
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <ActionButton.Refresh
              size="sm"
              loading={isRefreshing}
              onClick={() => fetchData(true)}
              className="bg-white/20 text-white border-white/30 hover:bg-white hover:text-primary backdrop-blur-md font-bold shadow-md"
            >
              Sync Data
            </ActionButton.Refresh>
          </div>
        </div>
      </div>

      {/* Interactive Active Order Live Tracker */}
      {activeOrder ? (
        <Card className="border-2 border-primary/50 bg-primary/5 p-6 shadow-lg rounded-3xl relative overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-primary/20 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="primary" pulse size="sm" className="font-black gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                  Live Order in Progress
                </Badge>
                <span className="text-xs font-bold text-primary font-mono">
                  #{activeOrder._id.slice(-6).toUpperCase()}
                </span>
              </div>
              <h2 className="text-xl font-black text-base-content">
                {activeOrder.restaurantId?.restaurantName || "Restaurant Partner"}
              </h2>
              <p className="text-xs text-base-content/70">
                {activeOrder.orderItems?.length || 0} delicious dishes • Total:{" "}
                <span className="font-extrabold text-base-content">
                  ₹{activeOrder.billDetails?.finalAmount}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="primary"
                onClick={() => onNavigateTab && onNavigateTab("order")}
                className="gap-2 font-bold shadow-md hover:shadow-primary/30"
              >
                Track Live Map <FiArrowRight />
              </Button>
            </div>
          </div>

          {/* Dynamic Stepper Bar */}
          <div className="mt-6">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center relative">
              {PROGRESS_STEPS.map((step, idx) => {
                const isPassed = idx <= activeStepIdx;
                const isCurrent = idx === activeStepIdx;

                return (
                  <div
                    key={step.key}
                    onMouseEnter={() => setActiveStepHover(idx)}
                    onMouseLeave={() => setActiveStepHover(null)}
                    onClick={() => onNavigateTab && onNavigateTab("order")}
                    className="flex flex-col items-center cursor-pointer group p-2 rounded-2xl hover:bg-primary/10 transition-all duration-200"
                  >
                    <div
                      className={`h-9 w-9 rounded-full flex items-center justify-center font-black text-xs transition-all duration-300 ${
                        isCurrent
                          ? "bg-primary text-white ring-4 ring-primary/30 scale-110 shadow-lg shadow-primary/40 animate-pulse"
                          : isPassed
                          ? "bg-emerald-500 text-white shadow-sm"
                          : "bg-base-200 text-base-content/40 group-hover:bg-base-300"
                      }`}
                    >
                      {isPassed ? <FiCheckCircle className="text-sm" /> : idx + 1}
                    </div>

                    <span
                      className={`mt-2 text-xs font-bold transition-colors ${
                        isCurrent
                          ? "text-primary"
                          : isPassed
                          ? "text-base-content"
                          : "text-base-content/40"
                      }`}
                    >
                      {step.label}
                    </span>

                    <span className="text-[10px] text-base-content/60 hidden md:block mt-0.5 line-clamp-1">
                      {step.desc}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Interactive Step Info Tooltip/Bar */}
            {activeStepHover !== null && (
              <div className="mt-3 py-1.5 px-3 rounded-xl bg-base-100 border border-base-200 text-center text-xs font-medium text-base-content/80 animate-in fade-in duration-200">
                <span className="font-bold text-primary">
                  Step {activeStepHover + 1}: {PROGRESS_STEPS[activeStepHover].label}
                </span>{" "}
                — {PROGRESS_STEPS[activeStepHover].desc}
              </div>
            )}
          </div>
        </Card>
      ) : (
        <Card className="p-6 border border-primary/20 bg-linear-to-r from-base-100 to-primary/5 rounded-3xl shadow-sm hover:shadow-md transition-all">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl shrink-0">
                <FiShoppingBag />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-base-content">
                  No Active Orders In Progress
                </h3>
                <p className="text-xs text-base-content/60 mt-0.5">
                  Hungry? Order from top-rated restaurants around you with lightning-fast delivery!
                </p>
              </div>
            </div>
            <Link to="/">
              <Button size="sm" variant="primary" className="gap-2 font-bold shadow-sm whitespace-nowrap">
                Browse Restaurants <FiArrowRight />
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Interactive Metric Stat Tiles */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total Orders Card */}
        <div
          onClick={() => onNavigateTab && onNavigateTab("order")}
          className="group relative overflow-hidden rounded-3xl border border-base-200 bg-base-100 p-5 shadow-sm hover:shadow-xl hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-base-content/70 uppercase tracking-wider">
              Total Orders
            </span>
            <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-lg group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <FiShoppingBag />
            </div>
          </div>
          <h3 className="text-3xl font-black text-base-content mt-3 group-hover:text-primary transition-colors">
            {orders.length}
          </h3>
          <div className="mt-2 flex items-center justify-between text-xs text-base-content/60">
            <span>All placed orders</span>
            <span className="font-bold text-primary inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              View History <FiArrowRight />
            </span>
          </div>
        </div>

        {/* Delivered Feasts Card */}
        <div
          onClick={() => {
            setOrderFilter("delivered");
            onNavigateTab && onNavigateTab("order");
          }}
          className="group relative overflow-hidden rounded-3xl border border-base-200 bg-base-100 p-5 shadow-sm hover:shadow-xl hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-base-content/70 uppercase tracking-wider">
              Delivered Feasts
            </span>
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-lg group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
              <FiCheckCircle />
            </div>
          </div>
          <h3 className="text-3xl font-black text-base-content mt-3 group-hover:text-emerald-600 transition-colors">
            {deliveredCount}
          </h3>
          <div className="mt-2 flex items-center justify-between text-xs text-base-content/60">
            <span>Fulfilled successfully</span>
            <span className="font-bold text-emerald-600 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Delivered <FiArrowRight />
            </span>
          </div>
        </div>

        {/* Saved Addresses Card */}
        <div
          onClick={() => onNavigateTab && onNavigateTab("addresses")}
          className="group relative overflow-hidden rounded-3xl border border-base-200 bg-base-100 p-5 shadow-sm hover:shadow-xl hover:border-orange-500/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-base-content/70 uppercase tracking-wider">
              Saved Locations
            </span>
            <div className="h-10 w-10 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center text-lg group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
              <FiMapPin />
            </div>
          </div>
          <h3 className="text-3xl font-black text-base-content mt-3 group-hover:text-orange-500 transition-colors">
            {addressesCount}
          </h3>
          <div className="mt-2 flex items-center justify-between text-xs text-base-content/60">
            <span>Fast checkout spots</span>
            <span className="font-bold text-orange-500 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Manage <FiArrowRight />
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Quick Action Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => onNavigateTab && onNavigateTab("menu")}
          className="p-4 rounded-2xl border border-base-200 bg-base-100 hover:border-primary hover:bg-primary/5 hover:-translate-y-1 hover:shadow-md transition-all duration-200 text-left flex flex-col justify-between cursor-pointer group"
        >
          <span className="text-2xl mb-2 group-hover:scale-125 transition-transform inline-block">🍕</span>
          <div>
            <h4 className="font-extrabold text-sm text-base-content group-hover:text-primary transition-colors">
              Order Food
            </h4>
            <p className="text-[11px] text-base-content/60 mt-0.5">Explore restaurants</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab && onNavigateTab("order")}
          className="p-4 rounded-2xl border border-base-200 bg-base-100 hover:border-primary hover:bg-primary/5 hover:-translate-y-1 hover:shadow-md transition-all duration-200 text-left flex flex-col justify-between cursor-pointer group"
        >
          <span className="text-2xl mb-2 group-hover:scale-125 transition-transform inline-block">🛵</span>
          <div>
            <h4 className="font-extrabold text-sm text-base-content group-hover:text-primary transition-colors">
              Track Order
            </h4>
            <p className="text-[11px] text-base-content/60 mt-0.5">Live GPS status</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab && onNavigateTab("addresses")}
          className="p-4 rounded-2xl border border-base-200 bg-base-100 hover:border-primary hover:bg-primary/5 hover:-translate-y-1 hover:shadow-md transition-all duration-200 text-left flex flex-col justify-between cursor-pointer group"
        >
          <span className="text-2xl mb-2 group-hover:scale-125 transition-transform inline-block">🏡</span>
          <div>
            <h4 className="font-extrabold text-sm text-base-content group-hover:text-primary transition-colors">
              Addresses
            </h4>
            <p className="text-[11px] text-base-content/60 mt-0.5">Manage delivery points</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab && onNavigateTab("complaints")}
          className="p-4 rounded-2xl border border-base-200 bg-base-100 hover:border-primary hover:bg-primary/5 hover:-translate-y-1 hover:shadow-md transition-all duration-200 text-left flex flex-col justify-between cursor-pointer group"
        >
          <span className="text-2xl mb-2 group-hover:scale-125 transition-transform inline-block">🎧</span>
          <div>
            <h4 className="font-extrabold text-sm text-base-content group-hover:text-primary transition-colors">
              Help Desk
            </h4>
            <p className="text-[11px] text-base-content/60 mt-0.5">Customer support</p>
          </div>
        </button>
      </div>

      {/* Interactive Recent Orders Stream with Filters & Search */}
      <Card
        className="rounded-3xl p-6"
        title="Recent Orders Stream"
        subtitle="Filter, review, and reorder from your past meal deliveries."
      >
        {/* Interactive Filter Tabs and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-5 pb-4 border-b border-base-200">
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {[
              { id: "all", label: "All", count: orders.length },
              {
                id: "active",
                label: "Active",
                count: orders.filter((o) =>
                  [
                    "placed",
                    "pending",
                    "restaurant_accepted",
                    "preparing",
                    "ready_for_pickup",
                    "rider_assigned",
                    "picked_up",
                    "out_for_delivery",
                  ].includes(o.orderStatus)
                ).length,
              },
              { id: "delivered", label: "Delivered", count: deliveredCount },
              {
                id: "cancelled",
                label: "Cancelled",
                count: orders.filter((o) => o.orderStatus === "cancelled").length,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setOrderFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  orderFilter === tab.id
                    ? "bg-primary text-white shadow-sm"
                    : "bg-base-200 text-base-content/70 hover:bg-base-300"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    orderFilter === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-base-300 text-base-content/60"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 text-xs" />
            <input
              type="text"
              placeholder="Search past restaurant or ID..."
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              className="input input-sm input-bordered w-full rounded-xl pl-8 text-xs"
            />
          </div>
        </div>

        {!filteredOrders.length ? (
          <EmptyState
            icon={FiShoppingBag}
            title={orderSearch ? "No matching orders found" : "No orders found"}
            description={
              orderSearch
                ? `No orders matching "${orderSearch}". Try a different keyword.`
                : "You don't have any orders in this category yet."
            }
            action={
              <Link to="/">
                <Button variant="primary" size="sm" className="font-bold">
                  Discover Delicious Foods
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {filteredOrders.slice(0, 6).map((order) => {
              const isOrderActive = [
                "placed",
                "pending",
                "restaurant_accepted",
                "preparing",
                "ready_for_pickup",
                "rider_assigned",
                "picked_up",
                "out_for_delivery",
              ].includes(order.orderStatus);

              return (
                <div
                  key={order._id}
                  onClick={() => onNavigateTab && onNavigateTab("order")}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-base-200 bg-base-100 hover:bg-base-200/50 hover:border-primary/40 hover:shadow-md transition-all duration-200 cursor-pointer gap-3 group"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`h-11 w-11 rounded-2xl flex items-center justify-center text-lg shrink-0 transition-transform group-hover:scale-110 ${
                        isOrderActive
                          ? "bg-primary/10 text-primary"
                          : order.orderStatus === "delivered"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-base-200 text-base-content/60"
                      }`}
                    >
                      {isOrderActive ? <FiTruck /> : <FiShoppingBag />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-sm text-base-content group-hover:text-primary transition-colors">
                          {order.restaurantId?.restaurantName || "Restaurant Partner"}
                        </h4>
                        <span className="text-[11px] font-mono text-base-content/50">
                          #{order._id.slice(-6).toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-base-content/60 mt-0.5">
                        {order.orderItems?.length || 0} items •{" "}
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-base-200">
                    <div className="sm:text-right">
                      <span className="font-black text-sm text-base-content block">
                        ₹{order.billDetails?.finalAmount}
                      </span>
                      <Badge
                        variant={
                          order.orderStatus === "delivered"
                            ? "success"
                            : order.orderStatus === "cancelled"
                            ? "error"
                            : "primary"
                        }
                        size="xs"
                        className="mt-0.5 capitalize"
                      >
                        {order.orderStatus.replace(/_/g, " ")}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <ActionButton.View
                        size="xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateTab && onNavigateTab("order");
                        }}
                      >
                        {isOrderActive ? "Track" : "View"}
                      </ActionButton.View>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};

export default UserOverView;
