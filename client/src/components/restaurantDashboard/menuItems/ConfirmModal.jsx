import React, { useState } from "react";
import api from "../../../config/ApiConfig";
import toast from "react-hot-toast";
import { Modal, Button } from "../../ui";

const ConfirmModal = ({
  selectedItem,
  modalMode,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!selectedItem) return;

    try {
      setIsLoading(true);
      let res;
      if (modalMode === "delete") {
        res = await api.delete(
          `/restaurant/delete-menu-item/${selectedItem._id}`,
        );
      } else {
        const payload = {};
        if (modalMode === "topRated")
          payload.isTopRated = !selectedItem.isTopRated;
        if (modalMode === "recommended")
          payload.isRecommended = !selectedItem.isRecommended;
        if (modalMode === "new") payload.isNew = !selectedItem.isNew;

        res = await api.patch(
          `/restaurant/update-menu-item-flags/${selectedItem._id}`,
          payload,
        );
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

  const getTitle = () => {
    if (modalMode === "delete") return "Delete Menu Item";
    if (modalMode === "topRated") return "Toggle Top Rated";
    if (modalMode === "recommended") return "Toggle Recommended";
    return "Toggle New Item";
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <p className="text-sm text-base-content/80">
          {modalMode === "delete" &&
            `Are you sure you want to permanently delete "${selectedItem?.itemName}" from your restaurant menu?`}
          {modalMode === "topRated" &&
            `Are you sure you want to change the Top Rated status for "${selectedItem?.itemName}"?`}
          {modalMode === "recommended" &&
            `Are you sure you want to change the Recommended badge for "${selectedItem?.itemName}"?`}
          {modalMode === "new" &&
            `Are you sure you want to toggle the "New" badge for "${selectedItem?.itemName}"?`}
        </p>

        <div className="flex justify-end gap-3 pt-3 border-t border-base-200">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant={modalMode === "delete" ? "error" : "primary"}
            onClick={handleConfirm}
            loading={isLoading}
          >
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
