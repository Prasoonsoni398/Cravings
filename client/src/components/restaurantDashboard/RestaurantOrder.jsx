import React, { useEffect, useState } from "react";
import api from "../../config/ApiConfig";
import { useSocket } from "../../context/SocketContext.jsx";
import {
  Button,
  Badge,
  FilterTabs,
  Card,
  EmptyState,
  LoadingSpinner,
} from "../ui";
import {
  FiClock,
  FiRefreshCw,
  FiUser,
  FiPhone,
  FiAlertCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";

const TAB_OPTIONS = [
  { id: "active", label: "Active Kitchen Orders" },
  { id: "history", label: "Past Orders History" },
];

const RestaurantOrder = () => {
  const { socket } = useSocket();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState("active");
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

  const getBadgeVariant = (st) => {
    if (st === "delivered") return "success";
    if (st === "cancelled" || st === "rejected") return "error";
    if (st === "placed" || st === "pending") return "primary";
    return "warning";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-base-content">
            Kitchen Orders & Dispatch
          </h1>
          <p className="text-xs text-base-content/60">
            Accept incoming orders, update kitchen preparation, and notify riders when food is ready.
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

      <div className="flex border-b border-base-200 pb-2">
        <FilterTabs
          tabs={[
            { id: "active", label: "Active Kitchen", count: activeOrders.length },
            { id: "history", label: "Order History", count: historyOrders.length },
          ]}
          activeTab={filterTab}
          onSelectTab={setFilterTab}
        />
      </div>

      {loading ? (
        <LoadingSpinner fullHeight label="Syncing kitchen stream..." />
      ) : !displayedOrders.length ? (
        <EmptyState
          icon={<FiClock />}
          title={
            filterTab === "active"
              ? "Kitchen is all caught up!"
              : "No historical orders"
          }
          message={
            filterTab === "active"
              ? "No pending dishes need preparation right now. Ready for fresh tickets!"
              : "No past fulfilled orders in record."
          }
        />
      ) : (
        <div className="space-y-4">
          {displayedOrders.map((order) => {
            const isNew = order.orderStatus === "placed" || order.orderStatus === "pending";
            const isAccepted = order.orderStatus === "restaurant_accepted";
            const isPreparing = order.orderStatus === "preparing";
            const isReady = order.orderStatus === "ready_for_pickup";

            return (
              <Card
                key={order._id}
                hoverEffect
                bodyClassName="p-5 space-y-4"
                className={
                  isNew
                    ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20"
                    : ""
                }
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-black text-primary">
                        #{order._id.slice(-6).toUpperCase()}
                      </span>
                      <Badge
                        variant={getBadgeVariant(order.orderStatus)}
                        size="xs"
                        pulse={isNew}
                      >
                        {order.orderStatus.replace(/_/g, " ")}
                      </Badge>
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
                        <span>Chef Note: "{order.specialInstructions}"</span>
                      </div>
                    )}
                  </div>

                  {/* Kitchen Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                    {isNew && (
                      <div className="flex items-center gap-2">
                        <select
                          className="select select-xs select-bordered rounded-lg text-xs"
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
                        <Button
                          variant="primary"
                          size="xs"
                          onClick={() =>
                            handleUpdateStatus(order._id, "restaurant_accepted")
                          }
                        >
                          Accept Order
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => handleUpdateStatus(order._id, "rejected")}
                          className="text-error"
                        >
                          Reject
                        </Button>
                      </div>
                    )}

                    {isAccepted && (
                      <Button
                        variant="warning"
                        size="xs"
                        onClick={() => handleUpdateStatus(order._id, "preparing")}
                      >
                        Start Cooking 👨‍🍳
                      </Button>
                    )}

                    {isPreparing && (
                      <Button
                        variant="success"
                        size="xs"
                        onClick={() =>
                          handleUpdateStatus(order._id, "ready_for_pickup")
                        }
                      >
                        Food Ready for Pickup 🚀
                      </Button>
                    )}

                    {isReady && (
                      <Badge variant="success" size="sm" pulse>
                        Ready • Awaiting Rider Pickup
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Items Breakdown */}
                <div className="pt-3 border-t border-base-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {order.orderItems?.map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl bg-base-200/40 p-2.5 text-xs flex justify-between items-center"
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
                      Delivery: {order.deliveryAddress?.address},{" "}
                      {order.deliveryAddress?.city}
                    </span>
                    <span className="font-black text-sm text-primary">
                      Order Total: ₹{order.billDetails?.finalAmount} (
                      {order.paymentDetails?.paymentMethod?.toUpperCase()})
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RestaurantOrder;
