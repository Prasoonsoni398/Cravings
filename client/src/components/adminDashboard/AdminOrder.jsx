import React, { useEffect, useState } from "react";
import api from "../../config/ApiConfig";
import { useSocket } from "../../context/SocketContext.jsx";
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
  FiClock,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";
import toast from "react-hot-toast";

const STATUS_OPTIONS = [
  "all",
  "placed",
  "restaurant_accepted",
  "preparing",
  "ready_for_pickup",
  "rider_assigned",
  "picked_up",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "rejected",
];

const AdminOrder = () => {
  const { socket, joinRoom } = useSocket();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [overrideStatus, setOverrideStatus] = useState("");
  const [overrideNote, setOverrideNote] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const url =
        activeStatus === "all"
          ? "/admin/orders"
          : `/admin/orders?status=${activeStatus}`;
      const res = await api.get(url);
      if (res.data?.success) {
        setOrders(res.data.data || []);
      }
    } catch (error) {
      console.error("Failed to load admin orders:", error);
      toast.error("Failed to load platform orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    joinRoom("admin");

    if (socket) {
      socket.on("order:created", (newOrder) => {
        setOrders((prev) => [newOrder, ...prev.filter((o) => o._id !== newOrder._id)]);
        toast.success(`New order placed: #${newOrder._id.slice(-6).toUpperCase()}`);
      });

      socket.on("order:status_updated", (updated) => {
        setOrders((prev) =>
          prev.map((o) => (o._id === updated._id ? { ...o, ...updated } : o))
        );
        if (selectedOrder?._id === updated._id) {
          setSelectedOrder(updated);
        }
      });

      return () => {
        socket.off("order:created");
        socket.off("order:status_updated");
      };
    }
  }, [socket, activeStatus]);

  const handleStatusOverride = async (e) => {
    e.preventDefault();
    if (!overrideStatus) {
      toast.error("Select a status to update");
      return;
    }

    try {
      setIsUpdating(true);
      const res = await api.patch(
        `/admin/orders/${selectedOrder._id}/status`,
        {
          status: overrideStatus,
          note: overrideNote || `Admin overridden to ${overrideStatus}`,
        }
      );

      if (res.data?.success) {
        toast.success(`Order status updated to ${overrideStatus}`);
        setSelectedOrder(res.data.data);
        setOrders((prev) =>
          prev.map((o) => (o._id === selectedOrder._id ? res.data.data : o))
        );
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const q = searchQuery.toLowerCase();
    const orderId = order._id.toLowerCase();
    const customer = order.customerId?.fullName?.toLowerCase() || "";
    const restaurant = order.restaurantId?.restaurantName?.toLowerCase() || "";
    return orderId.includes(q) || customer.includes(q) || restaurant.includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-black text-base-content">
            Platform Orders Management
          </h1>
          <p className="text-sm text-base-content/60">
            Real-time feed across all active restaurants and delivery routes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            className="btn btn-sm btn-outline gap-2 rounded-xl"
          >
            <FiRefreshCw /> Refresh
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-base-200 bg-base-100 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`btn btn-xs rounded-lg capitalize ${
                activeStatus === status
                  ? "btn-primary text-white"
                  : "btn-ghost text-base-content/70 hover:bg-base-200"
              }`}
            >
              {status.replace(/_/g, " ")}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <FiSearch className="absolute left-3 top-3 text-base-content/40" />
          <input
            type="text"
            placeholder="Search order ID, user, restaurant..."
            className="input input-sm input-bordered w-full pl-9 rounded-xl text-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-base-200 bg-base-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <span className="loading loading-spinner loading-md text-primary"></span>
          </div>
        ) : !filteredOrders.length ? (
          <div className="py-16 text-center text-sm text-base-content/60">
            No matching orders found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-sm w-full">
              <thead>
                <tr className="border-b border-base-200 bg-base-200/50 text-xs font-bold text-base-content/70 uppercase">
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Restaurant</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-base-200/40">
                    <td className="font-mono text-xs font-bold text-primary">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td>
                      <div className="font-semibold text-xs text-base-content">
                        {order.customerId?.fullName || "Guest Customer"}
                      </div>
                      <div className="text-[10px] text-base-content/50">
                        {order.customerId?.phone || "No phone"}
                      </div>
                    </td>
                    <td>
                      <div className="font-semibold text-xs text-base-content">
                        {order.restaurantId?.restaurantName || "Restaurant"}
                      </div>
                      <div className="text-[10px] text-base-content/50">
                        {order.restaurantId?.phone || ""}
                      </div>
                    </td>
                    <td className="font-bold text-xs text-base-content">
                      ₹{order.billDetails?.finalAmount || 0}
                    </td>
                    <td>
                      <span className="badge badge-xs uppercase font-bold bg-base-200 text-[10px]">
                        {order.paymentDetails?.paymentMethod || "card"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge badge-sm text-[10px] font-bold capitalize ${
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
                      {new Date(order.createdAt).toLocaleDateString()}{" "}
                      <span className="text-[10px]">
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setOverrideStatus(order.orderStatus);
                        }}
                        className="btn btn-xs btn-outline btn-primary rounded-lg gap-1"
                      >
                        <FiEye /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details & Override Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-base-100 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-base-200 pb-4">
              <div>
                <span className="text-xs font-semibold text-primary uppercase">
                  Order Details
                </span>
                <h3 className="text-xl font-black text-base-content">
                  #{selectedOrder._id.slice(-6).toUpperCase()}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="btn btn-circle btn-sm btn-ghost"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Order Info & Items */}
              <div className="space-y-4">
                <div className="rounded-2xl bg-base-200/50 p-4">
                  <h4 className="text-xs font-bold uppercase text-base-content/60 mb-2">
                    Restaurant & Customer
                  </h4>
                  <p className="text-sm font-bold text-base-content">
                    {selectedOrder.restaurantId?.restaurantName}
                  </p>
                  <p className="text-xs text-base-content/70">
                    Customer: {selectedOrder.customerId?.fullName} (
                    {selectedOrder.customerId?.phone})
                  </p>
                </div>

                <div className="rounded-2xl bg-base-200/50 p-4">
                  <h4 className="text-xs font-bold uppercase text-base-content/60 mb-2">
                    Items Ordered ({selectedOrder.orderItems?.length || 0})
                  </h4>
                  <div className="space-y-2">
                    {selectedOrder.orderItems?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs border-b border-base-200/80 pb-2"
                      >
                        <span>
                          {item.quantity}x {item.name || "Item"}
                        </span>
                        <span className="font-bold">
                          ₹{(item.price || 0) * item.quantity}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm font-extrabold pt-1">
                      <span>Total Paid</span>
                      <span className="text-primary">
                        ₹{selectedOrder.billDetails?.finalAmount}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-base-200/50 p-4">
                  <h4 className="text-xs font-bold uppercase text-base-content/60 mb-1">
                    Delivery Address
                  </h4>
                  <p className="text-xs font-medium text-base-content">
                    {selectedOrder.deliveryAddress?.name} • {selectedOrder.deliveryAddress?.phone}
                  </p>
                  <p className="text-xs text-base-content/70">
                    {selectedOrder.deliveryAddress?.address},{" "}
                    {selectedOrder.deliveryAddress?.city} -{" "}
                    {selectedOrder.deliveryAddress?.pinCode}
                  </p>
                </div>
              </div>

              {/* Status Timeline & Admin Override Form */}
              <div className="space-y-4">
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                  <h4 className="text-xs font-bold uppercase text-primary mb-3">
                    Admin Status Override
                  </h4>
                  <form onSubmit={handleStatusOverride} className="space-y-3">
                    <select
                      className="select select-sm select-bordered w-full rounded-xl text-xs font-semibold"
                      value={overrideStatus}
                      onChange={(e) => setOverrideStatus(e.target.value)}
                    >
                      {STATUS_OPTIONS.filter((s) => s !== "all").map((st) => (
                        <option key={st} value={st}>
                          {st.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Audit note for status override..."
                      className="input input-sm input-bordered w-full rounded-xl text-xs"
                      value={overrideNote}
                      onChange={(e) => setOverrideNote(e.target.value)}
                    />
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="btn btn-sm btn-primary w-full rounded-xl text-white font-bold"
                    >
                      {isUpdating ? "Updating..." : "Apply Status Override"}
                    </button>
                  </form>
                </div>

                <div className="rounded-2xl bg-base-200/50 p-4">
                  <h4 className="text-xs font-bold uppercase text-base-content/60 mb-3">
                    Order Timeline
                  </h4>
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                    {selectedOrder.timeline?.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 text-xs border-l-2 border-primary pl-3 py-1"
                      >
                        <div>
                          <p className="font-bold capitalize text-base-content">
                            {step.status.replace(/_/g, " ")}
                          </p>
                          <p className="text-[11px] text-base-content/60">
                            {step.note}
                          </p>
                          <p className="text-[10px] text-base-content/40">
                            {new Date(step.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrder;
