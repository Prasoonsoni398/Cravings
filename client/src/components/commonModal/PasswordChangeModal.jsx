import React, { useState } from "react";
import api from "../../config/ApiConfig";
import toast from "react-hot-toast";
import { Modal, Button } from "../ui";

const PasswordChangeModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleCloseModal = () => {
    setFormData({
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleChangePassword = async () => {
    if (!formData.oldPassword || !formData.newPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (formData.newPassword !== formData.confirmNewPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.patch("/common/change-password", formData);
      toast.success(res.data?.message || "Password changed successfully!");
      handleCloseModal();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unknown error occurred during password change. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Modal
      isOpen={open}
      onClose={handleCloseModal}
      title="Change Account Password"
      maxWidth="max-w-md"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleChangePassword();
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
            Current Password
          </label>
          <input
            type="password"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            className="input input-bordered w-full rounded-xl text-sm"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="input input-bordered w-full rounded-xl text-sm"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            name="confirmNewPassword"
            value={formData.confirmNewPassword}
            onChange={handleChange}
            className="input input-bordered w-full rounded-xl text-sm"
            required
            disabled={isLoading}
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-base-200">
          <Button
            type="button"
            variant="ghost"
            onClick={handleCloseModal}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isLoading}
          >
            Change Password
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PasswordChangeModal;
