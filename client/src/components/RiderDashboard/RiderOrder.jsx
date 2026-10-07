import React, { useEffect, useState } from "react";
import api from "../../config/ApiConfig";
import { useSocket } from "../../context/SocketContext.jsx";
import {
  FiMapPin,
  FiPhone,
  FiCheckCircle,
  FiClock,
  FiRefreshCw,
  FiNavigation,
  FiDollarSign,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { Button, Badge, Card, EmptyState, LoadingSpinner } from "../ui";

const RiderOrder = () => {
  const { socket, joinRoom } = useSocket();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const res = await api.get("/rider/my-deliveries");
      if (res.data?.success) {
        setDeliveries(res.data.data || []);
      }
    } catch (error) {
      toast.error("Failed to load assigned deliveries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();

    if (socket) {
      socket.on("order:status_updated", (updated) => {
        setDeliveries((prev) =>
          prev.map((d) => (d._id === updated._id ? { ...d, ...updated } : d))
        );
      });
      return () => {
        socket.off("order:status_updated");
      };
    }
  }, [socket]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await api.patch(`/rider/orders/${orderId}/status`, {
        status: newStatus,
        note: `Rider updated status to ${newStatus}`,
      });
      if (res.data?.success) {
        toast.success(`Delivery updated: ${newStatus.replace(/_/g, " ")}`);
        setDeliveries((prev) =>
          prev.map((d) => (d._id === orderId ? res.data.data : d))
        );
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update delivery status");
    }
  };

  const activeDeliveries = deliveries.filter((d) => d.orderStatus !== "delivered" && d.orderStatus !== "cancelled");
  const pastDeliveries = deliveries.filter((d) => d.orderStatus === "delivered" || d.orderStatus === "cancelled");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-base-content">
            Delivery Route & Assignments
          </h1>
          <p className="text-sm text-base-content/60">
            Fulfill pickups and customer door-step drops in real-time.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={fetchDeliveries}
          icon={<FiRefreshCw />}
          className="self-start sm:self-auto"
        >
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <LoadingSpinner size="lg" label="Syncing delivery route..." />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Deliveries */}
          <Card
            title={`Active Deliveries (${activeDeliveries.length})`}
            subtitle="Live pickup and delivery steps requiring attention."
          >
            {!activeDeliveries.length ? (
              <EmptyState
                icon={FiCheckCircle}
                title="No active deliveries"
                description="No active delivery assignments. Accept orders from Overview to start!"
              />
            ) : (
              <div className="space-y-4">
                {activeDeliveries.map((order) => {
                  const status = order.orderStatus;
                  const isAssigned = status === "rider_assigned" || status === "ready_for_pickup";
                  const isArrived = status === "rider_arrived";
                  const isPickedUp = status === "picked_up" || status === "pickedUp";
                  const isOut = status === "out_for_delivery" || status === "outForDelivery";
                  const isCOD = order.paymentDetails?.paymentMethod === "cod";

                  return (
                    <div
                      key={order._id}
                      className="rounded-2xl border-2 border-primary/40 bg-base-100 p-5 shadow-sm space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-base-200 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-black text-primary">
                            #{order._id.slice(-6).toUpperCase()}
                          </span>
                          <Badge variant="warning" size="sm">
                            {status.replace(/_/g, " ")}
                          </Badge>
                        </div>
                        <span className="font-extrabold text-emerald-600 text-sm">
                          +₹40 Delivery Payout
                        </span>
                      </div>

                      {/* Pickup & Drop Points */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="rounded-xl bg-base-200/50 p-3 space-y-1">
                          <p className="font-bold text-primary flex items-center gap-1">
                            <FiMapPin /> 1. PICKUP RESTAURANT
                          </p>
                          <p className="font-extrabold text-sm text-base-content">
                            {order.restaurantId?.restaurantName}
                          </p>
                          <p className="text-base-content/70">
                            {order.restaurantId?.address}
                          </p>
                          {order.restaurantId?.phone && (
                            <p className="font-semibold text-base-content flex items-center gap-1 pt-1">
                              <FiPhone /> Call Restaurant: {order.restaurantId.phone}
                            </p>
                          )}
                        </div>

                        <div className="rounded-xl bg-base-200/50 p-3 space-y-1">
                          <p className="font-bold text-emerald-600 flex items-center gap-1">
                            <FiMapPin /> 2. DELIVERY DROP-OFF
                          </p>
                          <p className="font-extrabold text-sm text-base-content">
                            {order.deliveryAddress?.name}
                          </p>
                          <p className="text-base-content/70">
                            {order.deliveryAddress?.address}, {order.deliveryAddress?.city}
                          </p>
                          {order.deliveryAddress?.phone && (
                            <p className="font-semibold text-base-content flex items-center gap-1 pt-1">
                              <FiPhone /> Call Customer: {order.deliveryAddress.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Cash collection alert if COD */}
                      {isCOD && (
                        <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-2.5 text-xs text-amber-800 dark:text-amber-300 font-bold flex items-center gap-2">
                          <FiDollarSign />
                          Cash on Delivery Order: Collect ₹{order.billDetails?.finalAmount} from customer!
                        </div>
                      )}

                      {/* Delivery Step Buttons */}
                      <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-base-200">
                        {isAssigned && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleUpdateStatus(order._id, "rider_arrived")}
                          >
                            I Have Arrived at Restaurant
                          </Button>
                        )}

                        {isArrived && (
                          <Button
                            size="sm"
                            variant="warning"
                            onClick={() => handleUpdateStatus(order._id, "picked_up")}
                          >
                            Picked Up Food Package
                          </Button>
                        )}

                        {isPickedUp && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleUpdateStatus(order._id, "out_for_delivery")}
                          >
                            Start Journey (Out for Delivery)
                          </Button>
                        )}

                        {isOut && (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleUpdateStatus(order._id, "delivered")}
                          >
                            Mark Delivered & Complete Order 🎉
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Past Deliveries */}
          {pastDeliveries.length > 0 && (
            <Card
              title={`Completed Trips History (${pastDeliveries.length})`}
              subtitle="Deliveries you have successfully completed."
            >
              <div className="space-y-2">
                {pastDeliveries.map((order) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-base-200 bg-base-100 text-xs"
                  >
                    <div>
                      <span className="font-bold text-base-content">
                        {order.restaurantId?.restaurantName || "Restaurant"} → {order.deliveryAddress?.name}
                      </span>
                      <p className="text-base-content/50">
                        Completed on {new Date(order.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-emerald-600 block">
                        +₹40 Payout
                      </span>
                      <Badge variant="success" size="xs">
                        Delivered
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default RiderOrder;
