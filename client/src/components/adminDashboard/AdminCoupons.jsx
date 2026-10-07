import React, { useEffect, useState } from "react";
import api from "../../config/ApiConfig";
import { FiTag, FiPlus, FiCheck, FiX } from "react-icons/fi";
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
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-black text-base-content">
            Coupons & Promotional Discounts
          </h1>
          <p className="text-sm text-base-content/60">
            Create promo codes, define discounts, and drive customer retention.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-sm btn-primary text-white rounded-xl gap-2 font-bold"
        >
          <FiPlus /> Create Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full flex h-48 items-center justify-center">
            <span className="loading loading-spinner text-primary"></span>
          </div>
        ) : !coupons.length ? (
          <div className="col-span-full py-16 text-center text-sm text-base-content/60">
            No active coupons found. Create the first discount campaign!
          </div>
        ) : (
          coupons.map((c) => (
            <div
              key={c._id}
              className="rounded-2xl border border-dashed border-primary/40 bg-base-100 p-5 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="badge badge-primary font-mono font-black text-sm tracking-widest px-3 py-1">
                    {c.code}
                  </span>
                  <span
                    className={`badge badge-sm font-semibold ${
                      c.isActive ? "badge-success text-white" : "badge-ghost"
                    }`}
                  >
                    {c.isActive ? "Active" : "Disabled"}
                  </span>
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

              <div className="mt-4 pt-3 border-t border-base-200 flex justify-end">
                <button
                  onClick={() => handleToggle(c._id)}
                  className={`btn btn-xs rounded-lg ${
                    c.isActive ? "btn-outline btn-error" : "btn-outline btn-success"
                  }`}
                >
                  {c.isActive ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Coupon Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-base-100 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-base-200 pb-3">
              <h3 className="text-lg font-black text-base-content">
                Create Promo Coupon
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-circle btn-sm btn-ghost"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold block mb-1">Coupon Code</label>
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
                <label className="text-xs font-semibold block mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. 50% discount on first 3 orders"
                  className="input input-sm input-bordered w-full rounded-xl text-xs"
                  value={newCoupon.description}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, description: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold block mb-1">Type</label>
                  <select
                    className="select select-sm select-bordered w-full rounded-xl text-xs"
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
                  <label className="text-xs font-semibold block mb-1">Value</label>
                  <input
                    type="number"
                    className="input input-sm input-bordered w-full rounded-xl text-xs"
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
                  <label className="text-xs font-semibold block mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    className="input input-sm input-bordered w-full rounded-xl text-xs"
                    value={newCoupon.minOrderAmount}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, minOrderAmount: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Max Disc (₹)</label>
                  <input
                    type="number"
                    className="input input-sm input-bordered w-full rounded-xl text-xs"
                    value={newCoupon.maxDiscount}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, maxDiscount: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Valid Until</label>
                <input
                  type="date"
                  className="input input-sm input-bordered w-full rounded-xl text-xs"
                  value={newCoupon.validUntil}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, validUntil: e.target.value })
                  }
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-sm btn-primary w-full text-white font-bold rounded-xl mt-2"
              >
                Create Campaign Coupon
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
