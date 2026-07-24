import React, { useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import api from "../../../config/ApiConfig";
import toast from "react-hot-toast";

const ConfirmModal = ({ selectedItem, modalMode, isOpen, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!selectedItem) return;
    
    try {
      setIsLoading(true);
      let res;
      if (modalMode === "delete") {
        res = await api.delete(`/restaurant/delete-menu-item/${selectedItem._id}`);
      } else {
        const payload = {};
        if (modalMode === "topRated") payload.isTopRated = !selectedItem.isTopRated;
        if (modalMode === "recommended") payload.isRecommended = !selectedItem.isRecommended;
        if (modalMode === "new") payload.isNew = !selectedItem.isNew;
        
        res = await api.patch(`/restaurant/update-menu-item-flags/${selectedItem._id}`, payload);
      }
      toast.success(res.data.message);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <div className=" text-2xl flex justify-between items-center mb-4 border-b border-(--color-secondary) pb-2">
            <h1 className="text-(--color-primary)">Are you sure?</h1>
            <button
              className="text-red-300 hover:text-red-500"
              onClick={onClose}
              disabled={isLoading}
            >
              <IoMdCloseCircleOutline size={24} />
            </button>
          </div>
          <div className="mb-6 text-gray-700">
            <p className="text-lg">
              {modalMode === "delete" && `Delete "${selectedItem.itemName}" from the menu?`}
              {modalMode === "topRated" && `Toggle Top Rated status for "${selectedItem.itemName}"?`}
              {modalMode === "recommended" && `Toggle Recommended status for "${selectedItem.itemName}"?`}
              {modalMode === "new" && `Toggle New status for "${selectedItem.itemName}"?`}
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-(--color-primary) text-white rounded hover:opacity-90"
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? "Confirming..." : "Confirm"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmModal;
