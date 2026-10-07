import React, { useEffect, useState } from "react";
import api from "../../config/ApiConfig";
import { FiMapPin, FiPlus, FiTrash2, FiHome, FiBriefcase } from "react-icons/fi";
import toast from "react-hot-toast";
import { Button, Badge, Card, Modal, EmptyState, LoadingSpinner } from "../ui";

const UserAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    label: "Home",
    name: "",
    phone: "",
    address: "",
    landmark: "",
    city: "Bhopal",
    state: "Madhya Pradesh",
    pinCode: "",
    isDefault: false,
  });

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/customer/addresses");
      if (res.data?.success) {
        setAddresses(res.data.data || []);
      }
    } catch (error) {
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/customer/addresses", formData);
      if (res.data?.success) {
        toast.success("Address saved successfully");
        setShowModal(false);
        setFormData({
          label: "Home",
          name: "",
          phone: "",
          address: "",
          landmark: "",
          city: "Bhopal",
          state: "Madhya Pradesh",
          pinCode: "",
          isDefault: false,
        });
        fetchAddresses();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save address");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await api.delete(`/customer/addresses/${id}`);
      if (res.data?.success) {
        toast.success("Address deleted");
        setAddresses((prev) => prev.filter((a) => a._id !== id));
      }
    } catch (error) {
      toast.error("Failed to delete address");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-base-content">Saved Addresses</h1>
          <p className="text-sm text-base-content/60">
            Manage your delivery locations for faster checkout.
          </p>
        </div>
        <Button
          size="sm"
          variant="primary"
          icon={<FiPlus />}
          onClick={() => setShowModal(true)}
          className="font-bold self-start sm:self-auto"
        >
          Add New Address
        </Button>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <LoadingSpinner size="lg" label="Loading addresses..." />
        </div>
      ) : !addresses.length ? (
        <EmptyState
          icon={FiMapPin}
          title="No addresses saved yet"
          description="Add your home, office, or other delivery addresses for faster checkout."
          action={
            <Button
              variant="primary"
              size="sm"
              icon={<FiPlus />}
              onClick={() => setShowModal(true)}
            >
              Add First Address
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((addr) => (
            <Card
              key={addr._id}
              className="p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <Badge variant="primary" size="xs" className="gap-1">
                    {addr.label === "Home" ? <FiHome /> : <FiBriefcase />} {addr.label}
                  </Badge>
                  {addr.isDefault && (
                    <Badge variant="success" size="xs">
                      Default
                    </Badge>
                  )}
                </div>
                <h4 className="font-extrabold text-sm text-base-content mt-3">
                  {addr.name} ({addr.phone})
                </h4>
                <p className="text-xs text-base-content/70 mt-1 leading-relaxed">
                  {addr.address}
                  {addr.landmark ? `, Near ${addr.landmark}` : ""}, {addr.city} - {addr.pinCode}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-base-200 flex justify-end">
                <Button
                  size="xs"
                  variant="ghost"
                  className="text-error hover:bg-error/10 gap-1"
                  icon={<FiTrash2 />}
                  onClick={() => handleDelete(addr._id)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Address Modal */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Add Delivery Address"
          maxWidth="max-w-md"
        >
          <form onSubmit={handleSave} className="space-y-3">
            <div className="flex gap-2">
              {["Home", "Work", "Other"].map((lbl) => (
                <Button
                  key={lbl}
                  type="button"
                  size="xs"
                  variant={formData.label === lbl ? "primary" : "outline"}
                  onClick={() => setFormData({ ...formData, label: lbl })}
                  className="flex-1 font-bold"
                >
                  {lbl}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Contact Name *"
                className="input input-sm input-bordered w-full rounded-xl text-xs"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <input
                type="tel"
                placeholder="Phone Number *"
                className="input input-sm input-bordered w-full rounded-xl text-xs"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <input
              type="text"
              placeholder="House / Flat / Street Address *"
              className="input input-sm input-bordered w-full rounded-xl text-xs"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Landmark (Optional)"
                className="input input-sm input-bordered w-full rounded-xl text-xs"
                value={formData.landmark}
                onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
              />
              <input
                type="text"
                placeholder="Pin Code *"
                className="input input-sm input-bordered w-full rounded-xl text-xs"
                value={formData.pinCode}
                onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                required
              />
            </div>

            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="checkbox checkbox-xs checkbox-primary"
              />
              Set as default delivery address
            </label>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="sm"
                className="font-bold"
              >
                Save Address
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default UserAddresses;
