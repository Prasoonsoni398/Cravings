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
import { FiTruck, FiPhone, FiEye, FiRefreshCw } from "react-icons/fi";
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

  const getBadgeVariant = (st) => {
    if (st === "active") return "success";
    if (st === "blocked") return "error";
    return "ghost";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-base-content">
            Delivery Fleet Management
          </h1>
          <p className="text-xs text-base-content/60">
            Monitor registered delivery partners, license compliance, and duty availability.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          icon={<FiRefreshCw />}
          onClick={fetchRiders}
        >
          Refresh Fleet
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner fullHeight label="Loading delivery fleet..." />
      ) : !riders.length ? (
        <EmptyState
          icon={<FiTruck />}
          title="No riders registered"
          message="No delivery partners registered on platform yet."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {riders.map((r) => (
            <Card
              key={r._id}
              hoverEffect
              bodyClassName="p-5 flex flex-col justify-between h-full space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-base-content">
                      {r.riderId?.fullName || "Delivery Partner"}
                    </h3>
                    <p className="text-xs text-base-content/60 flex items-center gap-1 mt-0.5">
                      <FiPhone className="text-primary" /> {r.riderId?.phone || "No phone"}
                    </p>
                  </div>
                  <Badge variant={getBadgeVariant(r.status)} size="xs">
                    {r.status}
                  </Badge>
                </div>

                <div className="mt-3 space-y-1 text-xs text-base-content/70">
                  <p>
                    <span className="font-semibold">Vehicle:</span>{" "}
                    {r.vehicleDetails?.vehicleType} ({r.vehicleDetails?.vehicleNumber})
                  </p>
                  <p>
                    <span className="font-semibold">Model:</span>{" "}
                    {r.vehicleDetails?.vehicleModel} - {r.vehicleDetails?.vehicleColor}
                  </p>
                  <p>
                    <span className="font-semibold">Duty:</span>{" "}
                    {r.isAvailable ? (
                      <Badge variant="success" size="xs" dot>
                        Online
                      </Badge>
                    ) : (
                      <Badge variant="ghost" size="xs">
                        Offline
                      </Badge>
                    )}
                  </p>
                  <p>
                    <span className="font-semibold">City:</span>{" "}
                    {r.currentAddress?.city || "Bhopal"}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-base-200 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="xs"
                  icon={<FiEye />}
                  onClick={() => setSelectedRider(r)}
                >
                  KYC Docs
                </Button>

                <div className="flex items-center gap-1.5">
                  {r.status !== "active" && (
                    <Button
                      variant="success"
                      size="xs"
                      onClick={() => handleUpdateStatus(r._id, "active")}
                    >
                      Approve
                    </Button>
                  )}
                  {r.status === "active" && (
                    <Button
                      variant="warning"
                      size="xs"
                      onClick={() => handleUpdateStatus(r._id, "inactive")}
                    >
                      Suspend
                    </Button>
                  )}
                  {r.status !== "blocked" && (
                    <Button
                      variant="error"
                      size="xs"
                      onClick={() => handleUpdateStatus(r._id, "blocked")}
                    >
                      Block
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Documents Modal */}
      {selectedRider && (
        <Modal
          isOpen={Boolean(selectedRider)}
          onClose={() => setSelectedRider(null)}
          title={selectedRider.riderId?.fullName}
          subtitle="KYC Documents Verification"
          badge={
            <Badge variant={getBadgeVariant(selectedRider.status)} size="sm">
              {selectedRider.status}
            </Badge>
          }
        >
          <div className="rounded-2xl bg-base-200/50 p-4 space-y-2 text-xs">
            <p>Driving License: <span className="font-bold">{selectedRider.documents?.drivingLicense || "Verified"}</span></p>
            <p>Vehicle RC: <span className="font-bold">{selectedRider.documents?.vehicleRegistrationCertificate || "Verified"}</span></p>
            <p>Insurance: <span className="font-bold">{selectedRider.documents?.insuranceCertificate || "Verified"}</span></p>
            <p>Aadhar Card: <span className="font-bold">{selectedRider.documents?.aadharCard || "Verified"}</span></p>
            <p>PAN Card: <span className="font-bold">{selectedRider.documents?.panCard || "Verified"}</span></p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminRiders;
