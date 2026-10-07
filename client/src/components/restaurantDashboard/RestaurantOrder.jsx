import React, { useEffect, useState } from "react";
import api from "../../config/ApiConfig";
import { useSocket } from "../../context/SocketContext.jsx";
import {
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
  FiUser,
  FiPhone,
  FiMapPin,
  FiAlertCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";

const RestaurantOrder = () => {
  const { socket, joinRoom } = useSocket();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState("active"); // "active" or "history"
  const [prepTimes, setPrepTimes] = useState({});

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/restaurant/orders");
      if (res.data?.success) {
        setOrders(res.data.data || []);
      }
    } catch (error) {
      console.error("Failed to load restaurant orders:", error);
      toast.error("Failed to load kitchen orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    if (socket) {
      socket.on("order:created", (newOrder) => {
        toast.success(`🔔 New kitchen order #${newOrder._id.slice(-6).toUpperCase()}!`, {
          duration: 6000,
        });
        setOrders((prev) => [newOrder, ...prev.filter((o) => o._id !== newOrder._id)]);
      });

      socket.on("order:status_updated", (updatedOrder) => {
        setOrders((prev) =>
          prev.map((o) => (o._id === updatedOrder._id ? { ...o, ...updatedOrder } : o))
        );
      });

      return () => {
        socket.off("order:created");
        socket.off("order:status_updated");
      };
    }
  }, [socket]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const prepTime = prepTimes[orderId] || 25;
      const res = await api.patch(`/restaurant/orders/${orderId}/status`, {
        status: newStatus,
        preparationTime: newStatus === "restaurant_accepted" ? prepTime : undefined,
        note: `Restaurant marked order as ${newStatus}`,
      });

      if (res.data?.success) {
        toast.success(`Order updated to ${newStatus.replace(/_/g, " ")}`);
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? res.data.data : o))
        );
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update order status");
    }
  };

  const activeOrders = orders.filter((o) =>
    ["placed", "pending", "restaurant_accepted", "preparing", "ready_for_pickup"].includes(
      o.orderStatus
    )
  );

  const historyOrders = orders.filter((o) =>
    !["placed", "pending", "restaurant_accepted", "preparing", "ready_for_pickup"].includes(
      o.orderStatus
    )
  );

  const displayedOrders = filterTab === "active" ? activeOrders : historyOrders;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-black text-base-content">
            Kitchen Orders & Dispatch
          </h1>
          <p className="text-sm text-base-content/60">
            Accept incoming orders, update kitchen preparation, and notify riders when food is ready.
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="btn btn-sm btn-outline rounded-xl gap-2 self-start md:self-auto cursor-pointer"
        >
          <FiRefreshCw /> Refresh Orders
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 border-b border-base-200 pb-2">
        <button
          onClick={() => setFilterTab("active")}
          className={`btn btn-sm rounded-xl font-bold ${
            filterTab === "active"
              ? "btn-primary text-white"
              : "btn-ghost text-base-content/70"
          }`}
        >
          Active Kitchen Orders ({activeOrders.length})
        </button>
        <button
          onClick={() => setFilterTab("history")}
          className={`btn btn-sm rounded-xl font-bold ${
            filterTab === "history"
              ? "btn-primary text-white"
              : "btn-ghost text-base-content/70"
          }`}
        >
          Past Orders History ({historyOrders.length})
        </button>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <span className="loading loading-spinner loading-md text-primary"></span>
        </div>
      ) : !displayedOrders.length ? (
        <div className="rounded-2xl border border-base-200 bg-base-100 p-12 text-center text-sm text-base-content/60 shadow-sm">
          {filterTab === "active"
            ? "No active orders in kitchen right now. Ready for new orders!"
            : "No past order history found."}
        </div>
      ) : (
        <div className="space-y-4">
          {displayedOrders.map((order) => {
            const isNew = order.orderStatus === "placed" || order.orderStatus === "pending";
            const isAccepted = order.orderStatus === "restaurant_accepted";
            const isPreparing = order.orderStatus === "preparing";
            const isReady = order.orderStatus === "ready_for_pickup";

            return (
              <div
                key={order._id}
                className={`rounded-2xl border p-5 shadow-sm transition ${
                  isNew
                    ? "border-primary/60 bg-primary/5 ring-1 ring-primary/30"
                    : "border-base-200 bg-base-100"
                }`}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  {/* Left: Order meta & Customer info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-black text-primary">
                        #{order._id.slice(-6).toUpperCase()}
                      </span>
                      <span
                        className={`badge badge-sm font-bold uppercase ${
                          order.orderStatus === "delivered"
                            ? "badge-success text-white"
                            : order.orderStatus === "cancelled" || order.orderStatus === "rejected"
                            ? "badge-error text-white"
                            : isNew
                            ? "badge-primary text-white animate-pulse"
                            : "badge-warning"
                        }`}
                      >
                        {order.orderStatus.replace(/_/g, " ")}
                      </span>
                      <span className="text-xs text-base-content/50">
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="text-xs text-base-content/80 flex items-center gap-3">
                      <span className="font-semibold text-base-content flex items-center gap-1">
                        <FiUser /> {order.customerId?.fullName || "Customer"}
                      </span>
                      {order.customerId?.phone && (
                        <span className="flex items-center gap-1">
                          <FiPhone /> {order.customerId.phone}
                        </span>
                      )}
                    </div>

                    {order.specialInstructions && (
                      <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-2.5 text-xs text-amber-800 dark:text-amber-300 font-medium flex items-start gap-2">
                        <FiAlertCircle className="shrink-0 mt-0.5" />
                        <span>Kitchen Note: "{order.specialInstructions}"</span>
                      </div>
                    )}
                  </div>

                  {/* Right: Action Buttons based on status */}
                  <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
                    {isNew && (
                      <div className="flex items-center gap-2">
                        <select
                          className="select select-xs select-bordered rounded-lg"
                          value={prepTimes[order._id] || 25}
                          onChange={(e) =>
                            setPrepTimes({
                              ...prepTimes,
                              [order._id]: Number(e.target.value),
                            })
                          }
                        >
                          <option value={15}>15 mins</option>
                          <option value={25}>25 mins</option>
                          <option value={35}>35 mins</option>
                          <option value={45}>45 mins</option>
                        </select>
                        <button
                          onClick={() =>
                            handleUpdateStatus(order._id, "restaurant_accepted")
                          }
                          className="btn btn-sm btn-primary text-white rounded-xl font-bold"
                        >
                          Accept Order
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(order._id, "rejected")}
                          className="btn btn-sm btn-ghost text-error rounded-xl font-bold"
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {isAccepted && (
                      <button
                        onClick={() => handleUpdateStatus(order._id, "preparing")}
                        className="btn btn-sm btn-warning text-white rounded-xl font-bold"
                      >
                        Start Preparing 👨‍🍳
                      </button>
                    )}

                    {isPreparing && (
                      <button
                        onClick={() =>
                          handleUpdateStatus(order._id, "ready_for_pickup")
                        }
                        className="btn btn-sm btn-success text-white rounded-xl font-bold"
                      >
                        Food Ready for Pickup 🚀
                      </button>
                    )}

                    {isReady && (
                      <span className="badge badge-success text-white font-bold p-3">
                        Ready • Waiting for Rider Pickup
                      </span>
                    )}
                  </div>
                </div>

                {/* Items Breakdown */}
                <div className="mt-4 pt-4 border-t border-base-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {order.orderItems?.map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl bg-base-200/40 p-3 text-xs flex justify-between items-center"
                      >
                        <span className="font-bold text-base-content">
                          {item.quantity}x {item.name || "Item"}
                        </span>
                        <span className="text-base-content/70">
                          ₹{(item.price || 0) * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex justify-between items-center text-xs font-semibold text-base-content/80">
                    <span>
                      Delivery to: {order.deliveryAddress?.address},{" "}
                      {order.deliveryAddress?.city}
                    </span>
                    <span className="font-black text-sm text-primary">
                      Order Total: ₹{order.billDetails?.finalAmount} (
                      {order.paymentDetails?.paymentMethod?.toUpperCase()})
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RestaurantOrder;
