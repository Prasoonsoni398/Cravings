import React, { useEffect, useState } from "react";
import api from "../../config/ApiConfig";
import { useAuth } from "../../context/AuthContext.jsx";
import { useSocket } from "../../context/SocketContext.jsx";
import {
  FiTruck,
  FiDollarSign,
  FiCheckCircle,
  FiClock,
  FiPower,
  FiMapPin,
  FiPhone,
  FiNavigation,
} from "react-icons/fi";
import toast from "react-hot-toast";

const RiderOverView = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const { socket, joinRoom } = useSocket();
  const [profile, setProfile] = useState(null);
  const [earnings, setEarnings] = useState(null);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  const fetchRiderData = async () => {
    try {
      const [profRes, earnRes, availRes] = await Promise.all([
        api.get("/rider/profile"),
        api.get("/rider/earnings"),
        api.get("/rider/available-orders"),
      ]);

      if (profRes.data?.data) setProfile(profRes.data.data);
      if (earnRes.data?.data) setEarnings(earnRes.data.data);
      if (availRes.data?.data) setAvailableOrders(availRes.data.data);
    } catch (error) {
      console.error("Failed to load rider overview:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiderData();
    if (user?._id) {
      joinRoom(`rider:${user._id}`);
    }

    // Geolocation simulation / GPS transmitter
    let watchId = null;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const coordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          try {
            await api.post("/rider/location", {
              coordinates,
              heading: position.coords.heading || 0,
              speed: position.coords.speed || 0,
            });
            if (socket) {
              socket.emit("rider:send_location", {
                riderId: user._id,
                coordinates,
              });
            }
          } catch (e) {
            // silent location sync
          }
        },
        (err) => console.log("Geo error:", err.message),
        { enableHighAccuracy: true, maximumAge: 10000 }
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [user]);

  const handleToggleOnline = async () => {
    try {
      setToggling(true);
      const res = await api.patch("/rider/toggle-availability");
      if (res.data?.success) {
        setProfile((prev) => ({ ...prev, isAvailable: res.data.isAvailable }));
        toast.success(
          `Duty status: ${res.data.isAvailable ? "ONLINE (Receiving orders)" : "OFFLINE"}`
        );
      }
    } catch (error) {
      toast.error("Failed to toggle availability");
    } finally {
      setToggling(false);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      const res = await api.post(`/rider/orders/${orderId}/accept`);
      if (res.data?.success) {
        toast.success("Order accepted! Head to the restaurant.");
        setAvailableOrders((prev) => prev.filter((o) => o._id !== orderId));
        if (onNavigateTab) onNavigateTab("orders");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to accept order");
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rider Status Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-primary to-orange-500 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="badge badge-sm bg-white/20 text-white border-0 font-bold uppercase">
              Rider Cockpit
            </span>
            <h1 className="mt-2 text-2xl font-black sm:text-3xl">
              Hello, {user?.fullName || "Delivery Partner"}!
            </h1>
            <p className="text-sm text-white/90 mt-1">
              Vehicle: {profile?.vehicleDetails?.vehicleType} ({profile?.vehicleDetails?.vehicleNumber}) • Zone: {profile?.currentAddress?.city || "Bhopal"}
            </p>
          </div>

          <button
            onClick={handleToggleOnline}
            disabled={toggling}
            className={`btn btn-sm rounded-xl font-bold border-0 shadow-md gap-2 cursor-pointer ${
              profile?.isAvailable
                ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                : "bg-rose-600 hover:bg-rose-700 text-white"
            }`}
          >
            <FiPower />
            {profile?.isAvailable ? "Duty: ONLINE" : "Duty: OFFLINE"}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-base-content/70 uppercase">
              Total Earnings
            </span>
            <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-500 text-lg">
              <FiDollarSign />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-base-content mt-3">
            ₹{earnings?.totalEarnings || 0}
          </h3>
          <p className="text-xs text-base-content/60 mt-1">
            ₹{earnings?.perDeliveryPayout || 40} payout per order
          </p>
        </div>

        <div className="rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-base-content/70 uppercase">
              Completed Trips
            </span>
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary text-lg">
              <FiCheckCircle />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-base-content mt-3">
            {earnings?.completedOrdersCount || 0}
          </h3>
          <p className="text-xs text-base-content/60 mt-1">Fulfilled deliveries</p>
        </div>

        <div className="rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-base-content/70 uppercase">
              GPS Tracking
            </span>
            <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-500 text-lg">
              <FiNavigation />
            </div>
          </div>
          <h3 className="text-xl font-bold text-emerald-600 mt-3 flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping"></span> Live Active
          </h3>
          <p className="text-xs text-base-content/60 mt-1">Broadcasting location</p>
        </div>
      </div>

      {/* Available Orders Ready for Pickup */}
      <div className="rounded-2xl border border-base-200 bg-base-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-base-content">
              Available Delivery Requests ({availableOrders.length})
            </h2>
            <p className="text-xs text-base-content/60">
              Orders ready or preparing at nearby restaurants looking for riders.
            </p>
          </div>
        </div>

        {!profile?.isAvailable ? (
          <div className="py-8 text-center text-sm text-base-content/60">
            You are currently OFFLINE. Switch Duty to ONLINE to receive order alerts!
          </div>
        ) : !availableOrders.length ? (
          <div className="py-8 text-center text-sm text-base-content/60">
            No orders awaiting riders right now. New pickups will appear here!
          </div>
        ) : (
          <div className="space-y-3">
            {availableOrders.map((order) => (
              <div
                key={order._id}
                className="rounded-xl border border-base-200 p-4 hover:border-primary/50 transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-primary">
                      #{order._id.slice(-6).toUpperCase()}
                    </span>
                    <span className="badge badge-warning badge-xs font-bold uppercase">
                      {order.orderStatus.replace(/_/g, " ")}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-base-content mt-1">
                    Pickup: {order.restaurantId?.restaurantName}
                  </h4>
                  <p className="text-base-content/60 flex items-center gap-1 mt-0.5">
                    <FiMapPin className="text-primary" /> {order.restaurantId?.address},{" "}
                    {order.restaurantId?.phone}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className="font-extrabold text-emerald-600 text-sm">
                    +₹40 Payout
                  </span>
                  <button
                    onClick={() => handleAcceptOrder(order._id)}
                    className="btn btn-sm btn-primary text-white rounded-xl font-bold"
                  >
                    Accept Delivery
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RiderOverView;
