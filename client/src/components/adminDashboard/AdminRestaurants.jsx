import React, { useEffect, useState } from "react";
import api from "../../config/ApiConfig";
import {
  Button,
  Badge,
  SearchInput,
  FilterTabs,
  Card,
  Modal,
  EmptyState,
  LoadingSpinner,
} from "../ui";
import { FiEye, FiMapPin, FiPhone, FiRefreshCw } from "react-icons/fi";
import { FaStore } from "react-icons/fa";
import toast from "react-hot-toast";

const STATUS_TABS = [
  { id: "all", label: "All Stores" },
  { id: "active", label: "Active" },
  { id: "inactive", label: "Pending / Inactive" },
  { id: "blocked", label: "Blocked" },
];

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
          ? `/admin/restaurants?search=${encodeURIComponent(search)}`
          : `/admin/restaurants?status=${statusFilter}&search=${encodeURIComponent(search)}`;
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
            Restaurant Management & Onboarding
          </h1>
          <p className="text-xs text-base-content/60">
            Review partner restaurants, inspect FSSAI certifications, and manage platform listings.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          icon={<FiRefreshCw />}
          onClick={fetchRestaurants}
        >
          Refresh Stores
        </Button>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-base-200 bg-base-100 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <FilterTabs
          tabs={STATUS_TABS}
          activeTab={statusFilter}
          onSelectTab={setStatusFilter}
        />

        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={fetchRestaurants}
          onClear={() => {
            setSearch("");
            fetchRestaurants();
          }}
          placeholder="Search restaurant name..."
          className="md:max-w-xs"
        />
      </div>

      {loading ? (
        <LoadingSpinner fullHeight label="Loading restaurants directory..." />
      ) : !restaurants.length ? (
        <EmptyState
          icon={<FaStore />}
          title="No restaurants found"
          message="No restaurant profiles match the selected status or query."
          actionLabel="View All Stores"
          onAction={() => {
            setStatusFilter("all");
            setSearch("");
            fetchRestaurants();
          }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((r) => (
            <Card
              key={r._id}
              hoverEffect
              bodyClassName="p-5 flex flex-col justify-between h-full space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-base text-base-content">
                      {r.restaurantName}
                    </h3>
                    <p className="text-xs text-base-content/60 flex items-center gap-1 mt-0.5">
                      <FiMapPin className="text-primary" /> {r.city || "Bhopal"},{" "}
                      {r.state || "MP"}
                    </p>
                  </div>
                  <Badge variant={getBadgeVariant(r.status)} size="xs">
                    {r.status}
                  </Badge>
                </div>

                <div className="mt-3 space-y-1 text-xs text-base-content/70">
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
                    <span className="font-semibold">Store Status:</span>{" "}
                    {r.isOpen ? (
                      <span className="text-success font-bold">Open</span>
                    ) : (
                      <span className="text-error font-bold">Closed</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-base-200 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="xs"
                  icon={<FiEye />}
                  onClick={() => setSelectedRest(r)}
                >
                  Docs
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

      {/* Restaurant Document Modal */}
      {selectedRest && (
        <Modal
          isOpen={Boolean(selectedRest)}
          onClose={() => setSelectedRest(null)}
          title={selectedRest.restaurantName}
          subtitle="Verification Documents & Banking"
          badge={
            <Badge variant={getBadgeVariant(selectedRest.status)} size="sm">
              {selectedRest.status}
            </Badge>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="rounded-2xl bg-base-200/50 p-4 space-y-1.5">
              <p className="font-bold text-sm text-base-content mb-1">
                Legal & Registrations
              </p>
              <p>Legal Name: {selectedRest.documents?.legalName || "Not provided"}</p>
              <p>Company Type: {selectedRest.documents?.companyType || "Sole Proprietor"}</p>
              <p>GST Certificate: {selectedRest.documents?.gstCertificate || "Pending"}</p>
              <p>FSSAI License: {selectedRest.documents?.fssaiCertificate || "Pending"}</p>
              <p>PAN Card: {selectedRest.documents?.panCard || "Pending"}</p>
            </div>

            <div className="rounded-2xl bg-base-200/50 p-4 space-y-1.5">
              <p className="font-bold text-sm text-base-content mb-1">
                Bank & Financials
              </p>
              <p>Bank: {selectedRest.financialDetails?.bankName || "Not set"}</p>
              <p>Account No: {selectedRest.financialDetails?.accountNumber || "Not set"}</p>
              <p>IFSC: {selectedRest.financialDetails?.ifscCode || "Not set"}</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminRestaurants;
