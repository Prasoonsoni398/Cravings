import React, { useEffect, useState } from "react";
import api from "../../config/ApiConfig";
import { useSocket } from "../../context/SocketContext.jsx";
import {
  Button,
  Badge,
  SearchInput,
  FilterTabs,
  Modal,
  EmptyState,
  LoadingSpinner,
} from "../ui";
import {
  FiEye,
  FiRefreshCw,
  FiMapPin,
  FiPhone,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";

const STATUS_TABS = [
  { id: "all", label: "All Orders" },
  { id: "placed", label: "Placed" },
  { id: "restaurant_accepted", label: "Accepted" },
  { id: "preparing", label: "Preparing" },
  { id: "ready_for_pickup", label: "Ready" },
  { id: "rider_assigned", label: "Rider Assigned" },
  { id: "out_for_delivery", label: "On Route" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
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

  const getBadgeVariant = (st) => {
    if (st === "delivered") return "success";
    if (st === "cancelled" || st === "rejected") return "error";
    if (st === "placed" || st === "pending") return "primary";
    return "warning";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-base-content">
            Platform Orders Management
          </h1>
          <p className="text-xs text-base-content/60">
            Real-time feed across all active restaurants and delivery routes.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          icon={<FiRefreshCw />}
          onClick={fetchOrders}
        >
          Refresh Orders
        </Button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-base-200 bg-base-100 p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <FilterTabs
          tabs={STATUS_TABS}
          activeTab={activeStatus}
          onSelectTab={setActiveStatus}
        />

        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search order ID, user, restaurant..."
          className="lg:max-w-xs"
        />
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-base-200 bg-base-100 shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner fullHeight label="Loading platform orders..." />
        ) : !filteredOrders.length ? (
          <EmptyState
            title="No orders found"
            message="No orders match your filter criteria or search query."
            actionLabel="Reset Filter"
            onAction={() => {
              setActiveStatus("all");
              setSearchQuery("");
            }}
          />
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
                  <tr key={order._id} className="hover:bg-base-200/40 transition">
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
                      <Badge variant="ghost" size="xs">
                        {order.paymentDetails?.paymentMethod || "CARD"}
                      </Badge>
                    </td>
                    <td>
                      <Badge
                        variant={getBadgeVariant(order.orderStatus)}
                        size="xs"
                        pulse={order.orderStatus === "placed"}
                      >
                        {order.orderStatus.replace(/_/g, " ")}
                      </Badge>
                    </td>
                    <td className="text-xs text-base-content/60">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="text-right">
                      <Button
                        variant="outline"
                        size="xs"
                        icon={<FiEye />}
                        onClick={() => {
                          setSelectedOrder(order);
                          setOverrideStatus(order.orderStatus);
                        }}
                      >
                        Inspect
                      </Button>
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
        <Modal
          isOpen={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          title={`Order #${selectedOrder._id.slice(-6).toUpperCase()}`}
          subtitle={selectedOrder.restaurantId?.restaurantName}
          badge={
            <Badge variant={getBadgeVariant(selectedOrder.orderStatus)} size="sm">
              {selectedOrder.orderStatus.replace(/_/g, " ")}
            </Badge>
          }
          maxWidth="2xl"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 text-xs">
            {/* Order Items & Customer */}
            <div className="space-y-4">
              <div className="rounded-2xl bg-base-200/50 p-4">
                <h4 className="font-bold uppercase text-base-content/60 mb-2">
                  Customer & Delivery
                </h4>
                <p className="font-extrabold text-sm text-base-content">
                  {selectedOrder.customerId?.fullName}
                </p>
                <p className="text-base-content/70">
                  {selectedOrder.deliveryAddress?.address},{" "}
                  {selectedOrder.deliveryAddress?.city}
                </p>
                <p className="text-base-content/60 mt-1">
                  Phone: {selectedOrder.deliveryAddress?.phone || selectedOrder.customerId?.phone}
                </p>
              </div>

              <div className="rounded-2xl bg-base-200/50 p-4">
                <h4 className="font-bold uppercase text-base-content/60 mb-2">
                  Order Items ({selectedOrder.orderItems?.length || 0})
                </h4>
                <div className="space-y-2">
                  {selectedOrder.orderItems?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between border-b border-base-200 pb-2"
                    >
                      <span className="font-medium text-base-content">
                        {item.quantity}x {item.name || "Item"}
                      </span>
                      <span className="font-bold">
                        ₹{(item.price || 0) * item.quantity}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm font-black pt-1">
                    <span>Total Amount</span>
                    <span className="text-primary">
                      ₹{selectedOrder.billDetails?.finalAmount}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Override & Timeline */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                <h4 className="font-bold uppercase text-primary mb-3">
                  Admin Status Override
                </h4>
                <form onSubmit={handleStatusOverride} className="space-y-3">
                  <select
                    className="select select-sm select-bordered w-full rounded-xl text-xs font-semibold"
                    value={overrideStatus}
                    onChange={(e) => setOverrideStatus(e.target.value)}
                  >
                    {STATUS_TABS.filter((s) => s.id !== "all").map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Audit reason note..."
                    className="input input-sm input-bordered w-full rounded-xl text-xs"
                    value={overrideNote}
                    onChange={(e) => setOverrideNote(e.target.value)}
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    fullWidth
                    loading={isUpdating}
                  >
                    Apply Status Override
                  </Button>
                </form>
              </div>

              <div className="rounded-2xl bg-base-200/50 p-4">
                <h4 className="font-bold uppercase text-base-content/60 mb-3">
                  Activity Timeline
                </h4>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                  {selectedOrder.timeline?.map((step, idx) => (
                    <div
                      key={idx}
                      className="border-l-2 border-primary pl-3 py-1 space-y-0.5"
                    >
                      <p className="font-bold capitalize text-base-content">
                        {step.status.replace(/_/g, " ")}
                      </p>
                      <p className="text-[11px] text-base-content/70">{step.note}</p>
                      <p className="text-[10px] text-base-content/40">
                        {new Date(step.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminOrder;
