import React, { useEffect, useState } from "react";
import api from "../../config/ApiConfig";
import { FiMapPin, FiPlus, FiTrash2, FiCheck, FiHome, FiBriefcase } from "react-icons/fi";
import toast from "react-hot-toast";

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
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-sm btn-primary text-white rounded-xl gap-2 font-bold"
        >
          <FiPlus /> Add New Address
        </button>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <span className="loading loading-spinner text-primary"></span>
        </div>
      ) : !addresses.length ? (
        <div className="rounded-2xl border border-base-200 bg-base-100 p-12 text-center text-sm text-base-content/60 shadow-sm">
          No addresses saved yet. Add your home or office address!
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className="rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="badge badge-primary font-bold text-xs gap-1">
                    {addr.label === "Home" ? <FiHome /> : <FiBriefcase />} {addr.label}
                  </span>
                  {addr.isDefault && (
                    <span className="badge badge-success text-white text-[10px] font-bold">
                      Default
                    </span>
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
                <button
                  onClick={() => handleDelete(addr._id)}
                  className="btn btn-xs btn-ghost text-error gap-1"
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Address Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-base-100 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-base-200 pb-3">
              <h3 className="text-lg font-black text-base-content">Add Delivery Address</h3>
              <button onClick={() => setShowModal(false)} className="btn btn-circle btn-sm btn-ghost">
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-3">
              <div className="flex gap-2">
                {["Home", "Work", "Other"].map((lbl) => (
                  <button
                    key={lbl}
                    type="button"
                    onClick={() => setFormData({ ...formData, label: lbl })}
                    className={`btn btn-xs flex-1 rounded-xl font-bold ${
                      formData.label === lbl ? "btn-primary text-white" : "btn-outline"
                    }`}
                  >
                    {lbl}
                  </button>
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

              <button
                type="submit"
                className="btn btn-sm btn-primary w-full text-white font-bold rounded-xl mt-2"
              >
                Save Address
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAddresses;
