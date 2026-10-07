import React, { useEffect, useState } from "react";
import api from "../../config/ApiConfig";
import { useSocket } from "../../context/SocketContext.jsx";
import {
  Button,
  Badge,
  Card,
  Modal,
  EmptyState,
  LoadingSpinner,
} from "../ui";
import {
  FiClock,
  FiMapPin,
  FiCheckCircle,
  FiStar,
  FiRefreshCw,
  FiTruck,
  FiPhone,
} from "react-icons/fi";
import toast from "react-hot-toast";

const PROGRESS_STEPS = [
  { key: "placed", label: "Order Placed" },
  { key: "restaurant_accepted", label: "Restaurant Accepted" },
  { key: "preparing", label: "Preparing Food" },
  { key: "ready_for_pickup", label: "Food Ready" },
  { key: "out_for_delivery", label: "Out for Delivery" },
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

const UserOrder = () => {
  const { socket, joinRoom } = useSocket();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Review modal state
  const [reviewOrder, setReviewOrder] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [riderRating, setRiderRating] = useState(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders/my");
      if (res.data?.data) {
        setOrders(res.data.data);
      }
    } catch (error) {
      console.error("Failed to load user orders:", error);
      toast.error("Unable to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    if (socket) {
      socket.on("order:status_updated", (updatedOrder) => {
        setOrders((prev) =>
          prev.map((o) => (o._id === updatedOrder._id ? { ...o, ...updatedOrder } : o))
        );
        if (selectedOrder?._id === updatedOrder._id) {
          setSelectedOrder(updatedOrder);
        }
        toast(`Order #${updatedOrder._id.slice(-6).toUpperCase()} updated: ${updatedOrder.orderStatus.replace(/_/g, " ")}`, {
          icon: "🛵",
        });
      });

      return () => {
        socket.off("order:status_updated");
      };
    }
  }, [socket]);

  const handleCancelOrder = async (orderId) => {
    const reason = window.prompt("Please enter a reason for cancellation:");
    if (!reason) return;

    try {
      const res = await api.patch(`/orders/${orderId}/cancel`, { reason });
      if (res.data?.data) {
        toast.success("Order cancelled");
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? res.data.data : o))
        );
        if (selectedOrder?._id === orderId) {
          setSelectedOrder(res.data.data);
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Cannot cancel order at this stage");
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      setIsSubmittingReview(true);
      await api.post("/customer/reviews", {
        orderId: reviewOrder._id,
        rating,
        comment,
        riderRating,
      });
      toast.success("Thank you for your review!");
      setReviewOrder(null);
      setComment("");
      fetchOrders();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const getBadgeVariant = (st) => {
    if (st === "delivered") return "success";
    if (st === "cancelled" || st === "rejected") return "error";
    if (st === "placed" || st === "pending") return "primary";
    return "warning";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-base-content">
            My Food Orders
          </h1>
          <p className="text-xs text-base-content/60">
            Track real-time meal preparation, delivery journey, and order receipts.
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

      {loading ? (
        <LoadingSpinner fullHeight label="Loading your food orders..." />
      ) : !orders.length ? (
        <EmptyState
          icon={<FiClock />}
          title="No food orders yet"
          message="You haven't placed any orders yet. Discover delicious foods from our menu explorer!"
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const stepIdx = getStepIndex(order.orderStatus);
            const canCancel = ["placed", "pending", "restaurant_accepted"].includes(
              order.orderStatus
            );

            return (
              <Card
                key={order._id}
                hoverEffect
                bodyClassName="p-5 space-y-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-extrabold text-base-content">
                        {order.restaurantId?.restaurantName || "Restaurant"}
                      </h3>
                      <Badge
                        variant={getBadgeVariant(order.orderStatus)}
                        size="xs"
                        pulse={stepIdx >= 0 && stepIdx < 5}
                      >
                        {order.orderStatus.replace(/_/g, " ")}
                      </Badge>
                    </div>

                    <p className="text-xs text-base-content/60 mt-1">
                      Order #{order._id.slice(-6).toUpperCase()} •{" "}
                      {new Date(order.createdAt).toLocaleDateString()} at{" "}
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {canCancel && (
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => handleCancelOrder(order._id)}
                        className="text-error border border-error/30"
                      >
                        Cancel
                      </Button>
                    )}
                    {order.orderStatus === "delivered" && (
                      <Button
                        variant="warning"
                        size="xs"
                        icon={<FiStar />}
                        onClick={() => setReviewOrder(order)}
                      >
                        Rate Meal
                      </Button>
                    )}
                    <Button
                      variant="primary"
                      size="xs"
                      onClick={() => {
                        setSelectedOrder(order);
                        joinRoom(`order:${order._id}`);
                      }}
                    >
                      Track Order
                    </Button>
                  </div>
                </div>

                {/* Items snapshot */}
                <div className="pt-3 border-t border-base-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                  {order.orderItems?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center bg-base-200/40 p-2.5 rounded-xl"
                    >
                      <span className="font-semibold text-base-content">
                        {item.quantity}x {item.name || "Item"}
                      </span>
                      <span className="text-base-content/70">
                        ₹{(item.price || 0) * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-between items-center text-xs font-semibold text-base-content/80">
                  <span>
                    Delivering to: {order.deliveryAddress?.address},{" "}
                    {order.deliveryAddress?.city}
                  </span>
                  <span className="text-sm font-black text-primary">
                    Paid ₹{order.billDetails?.finalAmount} (
                    {order.paymentDetails?.paymentMethod?.toUpperCase()})
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Live Order Tracking Modal */}
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
          {/* Stepper Progress */}
          <div className="my-4">
            <div className="grid grid-cols-6 gap-2 text-center">
              {PROGRESS_STEPS.map((step, idx) => {
                const currIdx = getStepIndex(selectedOrder.orderStatus);
                const isPassed = idx <= currIdx;
                const isCurrent = idx === currIdx;

                return (
                  <div key={step.key} className="flex flex-col items-center">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${
                        isCurrent
                          ? "bg-primary text-white ring-4 ring-primary/20 animate-pulse"
                          : isPassed
                          ? "bg-emerald-500 text-white"
                          : "bg-base-300 text-base-content/40"
                      }`}
                    >
                      {isPassed ? <FiCheckCircle /> : idx + 1}
                    </div>
                    <span className="mt-2 text-[10px] font-bold text-base-content/80 hidden sm:block">
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rider Info Card (if assigned) */}
          {selectedOrder.riderId && (
            <div className="rounded-2xl bg-indigo-500/10 border border-indigo-500/20 p-4 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-500 text-white rounded-xl">
                  <FiTruck className="text-xl" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-base-content">
                    Delivery Rider Assigned
                  </h4>
                  <p className="text-xs text-base-content/70">
                    Partner is on the route to pickup / deliver
                  </p>
                </div>
              </div>
              <Badge variant="info" size="xs">
                Active
              </Badge>
            </div>
          )}

          {/* Timeline Log */}
          <div className="rounded-2xl bg-base-200/50 p-4">
            <h4 className="text-xs font-bold uppercase text-base-content/60 mb-3">
              Order Activity Log
            </h4>
            <div className="space-y-3">
              {selectedOrder.timeline?.map((entry, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 border-l-2 border-primary pl-3 text-xs"
                >
                  <div>
                    <p className="font-bold capitalize text-base-content">
                      {entry.status.replace(/_/g, " ")}
                    </p>
                    <p className="text-base-content/70 text-[11px]">
                      {entry.note}
                    </p>
                    <p className="text-[10px] text-base-content/40 mt-0.5">
                      {new Date(entry.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}

      {/* Rating & Review Modal */}
      {reviewOrder && (
        <Modal
          isOpen={Boolean(reviewOrder)}
          onClose={() => setReviewOrder(null)}
          title="Rate & Review Meal"
          subtitle={`For order #${reviewOrder._id.slice(-6).toUpperCase()}`}
        >
          <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
            <div>
              <label className="font-bold block mb-1">
                Food Quality Rating (1 - 5 Stars)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setRating(num)}
                    className={`btn btn-sm btn-circle ${
                      rating >= num ? "btn-warning text-white" : "btn-outline"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-bold block mb-1">
                Comments / Dish Feedback
              </label>
              <textarea
                rows={3}
                placeholder="How was the taste, packaging, and temperature?"
                className="textarea textarea-bordered w-full rounded-xl text-xs"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <div>
              <label className="font-bold block mb-1">
                Delivery Service Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setRiderRating(num)}
                    className={`btn btn-sm btn-circle ${
                      riderRating >= num
                        ? "btn-info text-white"
                        : "btn-outline"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              fullWidth
              loading={isSubmittingReview}
            >
              Submit Review
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default UserOrder;
