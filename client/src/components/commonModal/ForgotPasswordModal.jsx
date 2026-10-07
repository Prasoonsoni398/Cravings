import React, { useState } from "react";
import api from "../../config/ApiConfig";
import toast from "react-hot-toast";
import { Modal, Button } from "../ui";

const ForgotPasswordModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const handleCloseModal = () => {
    onClose();
    setFormData({
      email: "",
      otp: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setIsOtpSent(false);
    setIsOtpVerified(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleResetPassword = async () => {
    try {
      setIsLoading(true);
      if (!isOtpSent) {
        if (!formData.email) {
          toast.error("Please enter your registered email");
          return;
        }
        const res = await api.post("/auth/send-otp", formData);
        toast.success(res.data.message || "OTP sent to your email!");
        setIsOtpSent(true);
      } else if (!isOtpVerified) {
        if (!formData.otp) {
          toast.error("Please enter the OTP");
          return;
        }
        const res = await api.post("/auth/verify-otp", formData);
        toast.success(res.data.message || "OTP verified!");
        setIsOtpVerified(true);
      } else {
        if (!formData.newPassword || !formData.confirmNewPassword) {
          toast.error("Please enter and confirm your new password");
          return;
        }
        if (formData.newPassword !== formData.confirmNewPassword) {
          toast.error("Passwords do not match");
          return;
        }
        const res = await api.post("/auth/reset-password", formData);
        toast.success(res.data.message || "Password reset successful!");
        handleCloseModal();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to process password reset. Please try again.",
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
      title="Reset Account Password"
      maxWidth="max-w-md"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleResetPassword();
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
            Registered Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input input-bordered w-full rounded-xl text-sm"
            required
            disabled={isLoading || isOtpSent}
            placeholder="you@example.com"
          />
        </div>

        {isOtpSent && (
          <div>
            <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
              6-Digit OTP
            </label>
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              className="input input-bordered w-full rounded-xl text-sm"
              required
              disabled={isLoading || isOtpVerified}
              placeholder="Enter received OTP"
            />
          </div>
        )}

        {isOtpSent && isOtpVerified && (
          <>
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
          </>
        )}

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
            {!isOtpSent ? "Send OTP" : !isOtpVerified ? "Verify OTP" : "Reset Password"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ForgotPasswordModal;
