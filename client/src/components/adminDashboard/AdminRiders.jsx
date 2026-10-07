import React, { useEffect, useState } from "react";
import api from "../../config/ApiConfig";
import {
  FiTruck,
  FiCheckCircle,
  FiSlash,
  FiPhone,
  FiMapPin,
  FiUser,
  FiEye,
} from "react-icons/fi";
import toast from "react-hot-toast";

const AdminRiders = () => {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRider, setSelectedRider] = useState(null);

  const fetchRiders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/riders");
      if (res.data?.success) {
        setRiders(res.data.data || []);
      }
    } catch (error) {
      toast.error("Failed to load delivery fleet");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiders();
  }, []);

  const handleUpdateStatus = async (riderDocId, newStatus) => {
    try {
      const res = await api.patch(`/admin/riders/${riderDocId}/status`, {
        status: newStatus,
      });
      if (res.data?.success) {
        toast.success(`Rider marked as ${newStatus}`);
        setRiders((prev) =>
          prev.map((r) => (r._id === riderDocId ? { ...r, status: newStatus } : r))
        );
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update rider status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-black text-base-content">
            Delivery Fleet Management
          </h1>
          <p className="text-sm text-base-content/60">
            Monitor registered delivery partners, license compliance, and duty availability.
          </p>
        </div>
        <button onClick={fetchRiders} className="btn btn-sm btn-outline rounded-xl">
          Refresh Fleet
        </button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <span className="loading loading-spinner loading-md text-primary"></span>
        </div>
      ) : !riders.length ? (
        <div className="py-16 text-center text-sm text-base-content/60">
          No delivery riders registered on platform yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {riders.map((r) => (
            <div
              key={r._id}
              className="rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-base-content">
                      {r.riderId?.fullName || "Delivery Partner"}
                    </h3>
                    <p className="text-xs text-base-content/60 flex items-center gap-1 mt-1">
                      <FiPhone className="text-primary" /> {r.riderId?.phone || "No phone"}
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
                    <span className="font-semibold">Vehicle:</span>{" "}
                    {r.vehicleDetails?.vehicleType} ({r.vehicleDetails?.vehicleNumber})
                  </p>
                  <p>
                    <span className="font-semibold">Model:</span>{" "}
                    {r.vehicleDetails?.vehicleModel} - {r.vehicleDetails?.vehicleColor}
                  </p>
                  <p>
                    <span className="font-semibold">Live Duty Status:</span>{" "}
                    {r.isAvailable ? (
                      <span className="text-success font-bold">Online</span>
                    ) : (
                      <span className="text-base-content/50 font-bold">Offline</span>
                    )}
                  </p>
                  <p>
                    <span className="font-semibold">City Base:</span>{" "}
                    {r.currentAddress?.city || "Bhopal"}
                  </p>
                </div>
              </div>

              <div className="mt-5 border-t border-base-200 pt-3 flex items-center justify-between">
                <button
                  onClick={() => setSelectedRider(r)}
                  className="btn btn-xs btn-outline rounded-lg"
                >
                  <FiEye /> Documents
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

      {/* Documents Modal */}
      {selectedRider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-base-100 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-base-200 pb-3">
              <h3 className="text-lg font-bold text-base-content">
                {selectedRider.riderId?.fullName} - KYC Documents
              </h3>
              <button
                onClick={() => setSelectedRider(null)}
                className="btn btn-circle btn-sm btn-ghost"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="rounded-xl bg-base-200/50 p-3">
                <p>Driving License: {selectedRider.documents?.drivingLicense || "Verified"}</p>
                <p>Vehicle RC: {selectedRider.documents?.vehicleRegistrationCertificate || "Verified"}</p>
                <p>Insurance: {selectedRider.documents?.insuranceCertificate || "Verified"}</p>
                <p>Aadhar Card: {selectedRider.documents?.aadharCard || "Verified"}</p>
                <p>PAN Card: {selectedRider.documents?.panCard || "Verified"}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRiders;
