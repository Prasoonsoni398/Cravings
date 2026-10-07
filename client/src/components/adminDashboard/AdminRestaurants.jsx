import React, { useEffect, useState } from "react";
import api from "../../config/ApiConfig";
import {
  FiCheckCircle,
  FiSlash,
  FiAlertTriangle,
  FiSearch,
  FiEye,
  FiMapPin,
  FiPhone,
  FiClock,
} from "react-icons/fi";
import { FaStore } from "react-icons/fa";
import toast from "react-hot-toast";

const AdminRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedRest, setSelectedRest] = useState(null);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const url =
        statusFilter === "all"
          ? `/admin/restaurants?search=${search}`
          : `/admin/restaurants?status=${statusFilter}&search=${search}`;
      const res = await api.get(url);
      if (res.data?.success) {
        setRestaurants(res.data.data || []);
      }
    } catch (error) {
      toast.error("Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [statusFilter]);

  const handleUpdateStatus = async (restaurantId, newStatus) => {
    try {
      const res = await api.patch(`/admin/restaurants/${restaurantId}/status`, {
        status: newStatus,
      });
      if (res.data?.success) {
        toast.success(`Restaurant marked as ${newStatus}`);
        setRestaurants((prev) =>
          prev.map((r) => (r._id === restaurantId ? { ...r, status: newStatus } : r))
        );
        if (selectedRest?._id === restaurantId) {
          setSelectedRest((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update restaurant status");
    }
  };

  const filtered = restaurants.filter((r) =>
    r.restaurantName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-black text-base-content">
            Restaurant Management & Onboarding
          </h1>
          <p className="text-sm text-base-content/60">
            Review partner restaurants, inspect FSSAI certifications, and manage platform listings.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-base-200 bg-base-100 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          {["all", "active", "inactive", "blocked"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`btn btn-xs rounded-lg capitalize ${
                statusFilter === st
                  ? "btn-primary text-white"
                  : "btn-ghost text-base-content/70 hover:bg-base-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <FiSearch className="absolute left-3 top-3 text-base-content/40" />
          <input
            type="text"
            placeholder="Search restaurant name..."
            className="input input-sm input-bordered w-full pl-9 rounded-xl text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchRestaurants()}
          />
        </div>
      </div>

      {/* Grid of Restaurants */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <span className="loading loading-spinner loading-md text-primary"></span>
        </div>
      ) : !filtered.length ? (
        <div className="py-16 text-center text-sm text-base-content/60">
          No restaurants found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <div
              key={r._id}
              className="rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-base text-base-content">
                      {r.restaurantName}
                    </h3>
                    <p className="text-xs text-base-content/60 flex items-center gap-1 mt-1">
                      <FiMapPin className="text-primary" /> {r.city || "Bhopal"},{" "}
                      {r.state || "MP"}
                    </p>
                  </div>
                  <span
                    className={`badge badge-sm font-bold capitalize ${
                      r.status === "active"
                        ? "badge-success text-white"
                        : r.status === "blocked"
                        ? "badge-error text-white"
                        : "badge-ghost"
                    }`}
                  >
                    {r.status}
                  </span>
                </div>

                <div className="mt-4 space-y-1 text-xs text-base-content/70">
                  <p>
                    <span className="font-semibold">Manager:</span>{" "}
                    {r.managerId?.fullName || "Not linked"}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span>{" "}
                    {r.contactDetails?.phone || r.managerId?.phone || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Cuisines:</span>{" "}
                    {r.cuisineTypes?.join(", ") || "General"}
                  </p>
                  <p>
                    <span className="font-semibold">Live Ordering:</span>{" "}
                    {r.isOpen ? (
                      <span className="text-success font-bold">Open</span>
                    ) : (
                      <span className="text-error font-bold">Closed</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-5 border-t border-base-200 pt-3 flex items-center justify-between">
                <button
                  onClick={() => setSelectedRest(r)}
                  className="btn btn-xs btn-outline rounded-lg"
                >
                  <FiEye /> View Docs
                </button>

                <div className="flex items-center gap-1">
                  {r.status !== "active" && (
                    <button
                      onClick={() => handleUpdateStatus(r._id, "active")}
                      className="btn btn-xs btn-success text-white rounded-lg"
                    >
                      Approve
                    </button>
                  )}
                  {r.status === "active" && (
                    <button
                      onClick={() => handleUpdateStatus(r._id, "inactive")}
                      className="btn btn-xs btn-warning text-white rounded-lg"
                    >
                      Suspend
                    </button>
                  )}
                  {r.status !== "blocked" && (
                    <button
                      onClick={() => handleUpdateStatus(r._id, "blocked")}
                      className="btn btn-xs btn-error text-white rounded-lg"
                    >
                      Block
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Restaurant Document Modal */}
      {selectedRest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-base-100 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-base-200 pb-3">
              <h3 className="text-lg font-bold text-base-content">
                {selectedRest.restaurantName} - Verification Details
              </h3>
              <button
                onClick={() => setSelectedRest(null)}
                className="btn btn-circle btn-sm btn-ghost"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="rounded-xl bg-base-200/50 p-3">
                <p className="font-bold text-base-content mb-1">Legal Documents</p>
                <p>Legal Name: {selectedRest.documents?.legalName || "Not provided"}</p>
                <p>Company Type: {selectedRest.documents?.companyType || "Sole Proprietor"}</p>
                <p>GST Certificate: {selectedRest.documents?.gstCertificate || "Pending"}</p>
                <p>FSSAI License: {selectedRest.documents?.fssaiCertificate || "Pending"}</p>
                <p>PAN Card: {selectedRest.documents?.panCard || "Pending"}</p>
              </div>

              <div className="rounded-xl bg-base-200/50 p-3">
                <p className="font-bold text-base-content mb-1">Financial & Banking</p>
                <p>Bank: {selectedRest.financialDetails?.bankName || "Not set"}</p>
                <p>Account No: {selectedRest.financialDetails?.accountNumber || "Not set"}</p>
                <p>IFSC: {selectedRest.financialDetails?.ifscCode || "Not set"}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRestaurants;
