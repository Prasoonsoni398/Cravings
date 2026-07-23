import React, { useState } from "react";
import { MdEdit } from "react-icons/md";
import toast from "react-hot-toast";

const BankingAndDocuments = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [editingBanking, setEditingBanking] = useState(false);
  
  const initialData = JSON.parse(sessionStorage.getItem("cravingRestaurant")) || {};
  
  const [bankingData, setBankingData] = useState({
    bankName: initialData?.bankName || "",
    accountNumber: initialData?.accountNumber || "",
    ifscCode: initialData?.ifscCode || "",
    panCard: initialData?.panCard || "",
    gst: initialData?.gst || "",
    fssai: initialData?.fssai || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBankingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      // Mock save
      console.log("bankingData", bankingData);
      toast.success("Banking details updated successfully");
      setEditingBanking(false);
    } catch (error) {
      toast.error("Failed to update banking details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setBankingData({
      bankName: initialData?.bankName || "",
      accountNumber: initialData?.accountNumber || "",
      ifscCode: initialData?.ifscCode || "",
      panCard: initialData?.panCard || "",
      gst: initialData?.gst || "",
      fssai: initialData?.fssai || "",
    });
    setEditingBanking(false);
  };

  return (
    <div className="bg-(--color-base-100) rounded-lg p-3 border border-primary/40">
      <div className="flex justify-between items-center border-b border-(--color-secondary) pb-2 mb-2">
        <div className="flex items-center gap-3">
          <h3 className="w-full text-sm font-semibold text-(--color-primary)">
            Banking & Documents
          </h3>
        </div>

        {!editingBanking ? (
          <div className="flex gap-3">
            <button
              onClick={() => setEditingBanking(true)}
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
          <label className="text-xs font-semibold">Bank Name</label>
          <input
            type="text"
            name="bankName"
            value={bankingData.bankName}
            onChange={handleChange}
            className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingBanking ? "bg-white" : "bg-(--color-base-100)"} rounded`}
            disabled={!editingBanking}
          />
        </div>
        <div className="w-full">
          <label className="text-xs font-semibold">Account Number</label>
          <input
            type="text"
            name="accountNumber"
            value={bankingData.accountNumber}
            onChange={handleChange}
            className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingBanking ? "bg-white" : "bg-(--color-base-100)"} rounded`}
            disabled={!editingBanking}
          />
        </div>
        <div className="w-full">
          <label className="text-xs font-semibold">IFSC Code</label>
          <input
            type="text"
            name="ifscCode"
            value={bankingData.ifscCode}
            onChange={handleChange}
            className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingBanking ? "bg-white" : "bg-(--color-base-100)"} rounded`}
            disabled={!editingBanking}
          />
        </div>
        <div className="w-full">
          <label className="text-xs font-semibold">Pan Card Number</label>
          <input
            type="text"
            name="panCard"
            value={bankingData.panCard}
            onChange={handleChange}
            className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingBanking ? "bg-white" : "bg-(--color-base-100)"} rounded`}
            disabled={!editingBanking}
          />
        </div>
        <div className="w-full">
          <label className="text-xs font-semibold">GST Number</label>
          <input
            type="text"
            name="gst"
            value={bankingData.gst}
            onChange={handleChange}
            className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingBanking ? "bg-white" : "bg-(--color-base-100)"} rounded`}
            disabled={!editingBanking}
          />
        </div>

        <div className="w-full">
          <label className="text-xs font-semibold">FSSAI Code</label>
          <input
            type="text"
            name="fssai"
            value={bankingData.fssai}
            onChange={handleChange}
            className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingBanking ? "bg-white" : "bg-(--color-base-100)"} rounded`}
            disabled={!editingBanking}
          />
        </div>
      </div>
    </div>
  );
};

export default BankingAndDocuments;
