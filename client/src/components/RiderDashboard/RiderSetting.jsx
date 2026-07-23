import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../config/ApiConfig";
import { useAuth } from "../../context/AuthContext.jsx";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { MdOutlineLockReset } from "react-icons/md";
import PasswordChangeModal from "../commonModal/PasswordChangeModal";

const RiderSetting = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [selectedProfilePic, setSelectedProfilePic] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] =
    useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        phone: user.phone || "",
        email: user.email || "",
      });
    }

    if (user?.photo?.url) {
      setProfilePicPreview(user.photo.url);
    } else if (user?.photo) {
      setProfilePicPreview(user.photo);
    } else {
      setProfilePicPreview(null);
    }
  }, [user]);

  const handleProfilePicChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedProfilePic(file);
    setProfilePicPreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?._id) return;

    setIsLoading(true);

    try {
      const uploadData = new FormData();
      uploadData.append("fullName", formData.fullName.trim());
      uploadData.append("phone", formData.phone.trim());
      uploadData.append("email", formData.email.trim());

      if (selectedProfilePic) {
        uploadData.append("displayPic", selectedProfilePic);
      }

      const res = await api.put("/common/edit-profile", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data.message || "Profile updated successfully.");
      sessionStorage.setItem("UserData", JSON.stringify(res.data.data));
      setUser(res.data.data);
      setSelectedProfilePic(null);
      setIsEditing(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to update your profile.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedProfilePic(null);
    setFormData({
      fullName: user.fullName || "",
      phone: user.phone || "",
      email: user.email || "",
    });
    if (user?.photo?.url) {
      setProfilePicPreview(user.photo.url);
    } else if (user?.photo) {
      setProfilePicPreview(user.photo);
    } else {
      setProfilePicPreview(null);
    }
  };

  if (!user) {
    return (
      <div className="p-6 text-gray-600">
        Please log in to view this section.
      </div>
    );
  }

  return (
    <>
      <div className="overflow-y-auto h-full p-6 space-y-6">
        {/* User Profile Section */}
        <div className="bg-(--color-base-200) rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Profile Information</h3>
            {!editingProfile ? (
              <div className="flex gap-3">
                <button
                  onClick={() => setEditingProfile(true)}
                  className="flex items-center gap-2 bg-(--color-primary) text-(--color-primary-content) px-3 py-1 rounded text-sm"
                >
                  <MdEdit /> Edit
                </button>
                <button
                  onClick={() => setIsPasswordChangeModalOpen(true)}
                  className="flex items-center gap-2 border border-(--color-primary) text-(--color-primary) px-3 py-1 rounded text-sm hover:bg-(--color-primary) hover:text-(--color-primary-content)"
                >
                  <MdOutlineLockReset /> Change Password
                </button>
              </div>
            ) : (
              <div className="flex gap-2 justify-end">
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center gap-2 bg-(--color-primary) text-(--color-primary-content) px-3 py-1 rounded text-sm"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={handleCancelProfile}
                  className="flex items-center gap-2 bg-(--color-secondary) text-(--color-secondary-content) px-3 py-1 rounded text-sm"
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-36 h-36">
                  <img
                    src={profilePicPreview || user.photo.url}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover border-2 border-(--color-primary)"
                  />
                </div>

                {editingProfile && (
                  <div
                    className="absolute cursor-pointer bottom-1 right-1 border p-2 rounded-full w-fit bg-(--color-base-200)"
                    title="Change Photo"
                  >
                    <label htmlFor="profilePic" className="cursor-pointer">
                      <MdOutlineAddAPhoto className="text-xl" />
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      name="profilePic"
                      id="profilePic"
                      className="hidden"
                      onChange={handleProfilePicChange}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4 w-full">
                <div className="grid grid-cols-5 gap-2 justify-center items-center">
                  <label className="block text-sm font-semibold mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleProfileChange}
                    className={`w-full px-3 py-2 border ${editingProfile ? "border-(--color-secondary)" : "border-transparent"} rounded col-span-4`}
                    disabled={!editingProfile}
                  />

                  <label className="block text-sm font-semibold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleProfileChange}
                    className={`w-full px-3 py-2 border ${editingProfile ? "border-(--color-secondary) text-(--color-secondary) disabled:bg-(--color-secondary)/50 cursor-not-allowed" : "border-transparent"} rounded col-span-4`}
                    disabled
                  />

                  <label className="block text-sm font-semibold mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleProfileChange}
                    className={`w-full px-3 py-2 border ${editingProfile ? "border-(--color-secondary)" : "border-transparent"} rounded col-span-4`}
                    disabled={!editingProfile}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isPasswordChangeModalOpen && (
        <PasswordChangeModal
          open={isPasswordChangeModalOpen}
          onClose={() => setIsPasswordChangeModalOpen(false)}
        />
      )}
    </>
  );
};

export default RiderSetting;
