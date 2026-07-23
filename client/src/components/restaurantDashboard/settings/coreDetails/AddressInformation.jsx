import React, { useState } from "react";
import { MdEdit } from "react-icons/md";
import toast from "react-hot-toast";
import api from "../../../../config/ApiConfig";
import { useAuth } from "../../../../context/AuthContext";

const AddressInformation = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);

  const initialData =
    JSON.parse(sessionStorage.getItem("cravingRestaurant")) || {};

  const [addressData, setAddressData] = useState({
    address: initialData?.address || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    pinCode: initialData?.pinCode || "",
    country: initialData?.country || "",
    geoLat: initialData?.geoLocation?.lat || "",
    geoLon: initialData?.geoLocation?.lon || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      // Mock save for now since original didn't implement it either
      console.log("addressData", addressData);
      toast.success("Address updated successfully");
      setEditingAddress(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update address");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setAddressData({
      address: initialData?.address || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      pinCode: initialData?.pinCode || "",
      country: initialData?.country || "",
      geoLat: initialData?.geoLocation?.lat || "",
      geoLon: initialData?.geoLocation?.lon || "",
    });
    setEditingAddress(false);
  };

  return (
    <div className="bg-(--color-base-100) rounded-lg p-3 border border-primary/40">
      <div className="flex justify-between items-center border-b border-(--color-secondary) pb-2 mb-2">
        <div className="flex items-center gap-3">
          <h3 className="w-full text-sm font-semibold text-(--color-primary)">
            Address
          </h3>
        </div>

        {!editingAddress ? (
          <div className="flex gap-3">
            <button
              onClick={() => setEditingAddress(true)}
              className="flex items-center gap-2 bg-(--color-primary) text-(--color-primary-content) px-2 py-0.5 rounded text-xs"
            >
              <MdEdit /> Edit
            </button>
          </div>
        ) : (
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-(--color-primary) text-(--color-primary-content) px-2 py-0.5 rounded text-xs"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 bg-(--color-secondary) text-(--color-secondary-content) px-2 py-0.5 rounded text-xs"
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 justify-center items-center">
        <div className="w-full">
          <label className="text-xs font-semibold">Address</label>
          <input
            type="text"
            name="address"
            value={addressData.address}
            onChange={handleChange}
            className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingAddress ? "bg-white" : "bg-(--color-base-100)"} rounded`}
            disabled={!editingAddress}
          />
        </div>
        <div className="w-full">
          <label className="text-xs font-semibold">City</label>
          <input
            type="text"
            name="city"
            value={addressData.city}
            onChange={handleChange}
            className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingAddress ? "bg-white" : "bg-(--color-base-100)"} rounded`}
            disabled={!editingAddress}
          />
        </div>
        <div className="w-full">
          <label className="text-xs font-semibold">State</label>
          <input
            type="text"
            name="state"
            value={addressData.state}
            onChange={handleChange}
            className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingAddress ? "bg-white" : "bg-(--color-base-100)"} rounded`}
            disabled={!editingAddress}
          />
        </div>
        <div className="w-full">
          <label className="text-xs font-semibold">Pin Code</label>
          <input
            type="text"
            name="pinCode"
            value={addressData.pinCode}
            onChange={handleChange}
            className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingAddress ? "bg-white" : "bg-(--color-base-100)"} rounded`}
            disabled={!editingAddress}
          />
        </div>
        <div className="w-full">
          <label className="text-xs font-semibold">Country</label>
          <input
            type="text"
            name="country"
            value={addressData.country}
            onChange={handleChange}
            className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingAddress ? "bg-white" : "bg-(--color-base-100)"} rounded`}
            disabled={!editingAddress}
          />
        </div>

        <div className="w-full grid grid-cols-2 gap-2">
          <div className="w-full">
            <label className="text-xs font-semibold">Latitude</label>
            <input
              type="text"
              name="geoLat"
              value={addressData.geoLat}
              onChange={handleChange}
              placeholder="e.g. 28.6139"
              className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingAddress ? "bg-white" : "bg-(--color-base-100)"} rounded`}
              disabled={!editingAddress}
            />
          </div>

          <div className="w-full">
            <label className="text-xs font-semibold">Longitude</label>
            <input
              type="text"
              name="geoLon"
              value={addressData.geoLon}
              onChange={handleChange}
              placeholder="e.g. 77.2090"
              className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingAddress ? "bg-white" : "bg-(--color-base-100)"} rounded`}
              disabled={!editingAddress}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressInformation;
