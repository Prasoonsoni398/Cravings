import React, { useEffect, useState } from "react";
import api from "../../config/ApiConfig";
import {
  Button,
  Badge,
  Card,
  Modal,
  EmptyState,
  LoadingSpinner,
} from "../ui";
import { FiTag, FiPlus, FiRefreshCw } from "react-icons/fi";
import toast from "react-hot-toast";

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: 20,
    maxDiscount: 100,
    minOrderAmount: 200,
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/coupons");
      if (res.data?.success) {
        setCoupons(res.data.data || []);
      }
    } catch (error) {
      toast.error("Failed to load discount coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/admin/coupons", newCoupon);
      if (res.data?.success) {
        toast.success("Coupon created successfully!");
        setCoupons((prev) => [res.data.data, ...prev]);
        setShowModal(false);
        setNewCoupon({
          code: "",
          description: "",
          discountType: "percentage",
          discountValue: 20,
          maxDiscount: 100,
          minOrderAmount: 200,
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create coupon");
    }
  };

  const handleToggle = async (couponId) => {
    try {
      const res = await api.patch(`/admin/coupons/${couponId}/toggle`);
      if (res.data?.success) {
        toast.success("Coupon updated");
        setCoupons((prev) =>
          prev.map((c) => (c._id === couponId ? res.data.data : c))
        );
      }
    } catch (error) {
      toast.error("Failed to toggle coupon");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-base-content">
            Coupons & Promotional Discounts
          </h1>
          <p className="text-xs text-base-content/60">
            Create promo codes, define discounts, and drive customer retention.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<FiRefreshCw />}
            onClick={fetchCoupons}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<FiPlus />}
            onClick={() => setShowModal(true)}
          >
            Create Coupon
          </Button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner fullHeight label="Loading promo coupons..." />
      ) : !coupons.length ? (
        <EmptyState
          icon={<FiTag />}
          title="No coupons created"
          message="No active promotional vouchers found. Create a discount campaign!"
          actionLabel="Create Coupon"
          onAction={() => setShowModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map((c) => (
            <Card
              key={c._id}
              hoverEffect
              bodyClassName="p-5 flex flex-col justify-between h-full space-y-4"
              className="border-dashed border-primary/40"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="badge badge-primary font-mono font-black text-sm tracking-widest px-3 py-1">
                    {c.code}
                  </span>
                  <Badge variant={c.isActive ? "success" : "ghost"} size="xs">
                    {c.isActive ? "Active" : "Disabled"}
                  </Badge>
                </div>
                <h3 className="font-bold text-base mt-3 text-base-content">
                  {c.discountType === "percentage"
                    ? `${c.discountValue}% OFF`
                    : `₹${c.discountValue} FLAT OFF`}
                </h3>
                <p className="text-xs text-base-content/70 mt-1">
                  {c.description}
                </p>
                <div className="mt-3 text-[11px] text-base-content/60 space-y-0.5">
                  <p>Min Order: ₹{c.minOrderAmount} • Max Discount: ₹{c.maxDiscount}</p>
                  <p>Valid until: {new Date(c.validUntil).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-base-200 flex justify-end">
                <Button
                  variant={c.isActive ? "error" : "success"}
                  size="xs"
                  onClick={() => handleToggle(c._id)}
                >
                  {c.isActive ? "Deactivate" : "Activate"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Coupon Modal */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Create Promotional Coupon"
          subtitle="Configure discount rates and order thresholds"
        >
          <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold block mb-1">Coupon Code</label>
              <input
                type="text"
                placeholder="e.g. CRAVE50"
                className="input input-sm input-bordered w-full rounded-xl uppercase font-bold"
                value={newCoupon.code}
                onChange={(e) =>
                  setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })
                }
                required
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Description</label>
              <input
                type="text"
                placeholder="e.g. 50% discount on order above ₹200"
                className="input input-sm input-bordered w-full rounded-xl"
                value={newCoupon.description}
                onChange={(e) =>
                  setNewCoupon({ ...newCoupon, description: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold block mb-1">Discount Type</label>
                <select
                  className="select select-sm select-bordered w-full rounded-xl text-xs font-semibold"
                  value={newCoupon.discountType}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, discountType: e.target.value })
                  }
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed (₹)</option>
                </select>
              </div>
              <div>
                <label className="font-semibold block mb-1">Value</label>
                <input
                  type="number"
                  className="input input-sm input-bordered w-full rounded-xl"
                  value={newCoupon.discountValue}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, discountValue: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold block mb-1">Min Order (₹)</label>
                <input
                  type="number"
                  className="input input-sm input-bordered w-full rounded-xl"
                  value={newCoupon.minOrderAmount}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, minOrderAmount: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Max Disc (₹)</label>
                <input
                  type="number"
                  className="input input-sm input-bordered w-full rounded-xl"
                  value={newCoupon.maxDiscount}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, maxDiscount: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1">Valid Until</label>
              <input
                type="date"
                className="input input-sm input-bordered w-full rounded-xl"
                value={newCoupon.validUntil}
                onChange={(e) =>
                  setNewCoupon({ ...newCoupon, validUntil: e.target.value })
                }
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              fullWidth
              className="mt-3"
            >
              Launch Promo Coupon
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminCoupons;
