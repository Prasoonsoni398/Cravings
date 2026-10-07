import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../config/ApiConfig";
import { useAuth } from "../../context/AuthContext.jsx";
import { MdEdit, MdOutlineAddAPhoto, MdOutlineLockReset } from "react-icons/md";
import PasswordChangeModal from "../commonModal/PasswordChangeModal";
import { Button, Card } from "../ui";

const AdminSetting = () => {
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
    if (e && e.preventDefault) e.preventDefault();
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
      fullName: user?.fullName || "",
      phone: user?.phone || "",
      email: user?.email || "",
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
      <div className="p-6 text-base-content/60">
        Please log in to view this section.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-base-content">Platform & Account Settings</h1>
          <p className="text-sm text-base-content/60">
            Manage your administrator profile credentials and preferences.
          </p>
        </div>

        {/* User Profile Card */}
        <Card className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-base-200 pb-4 mb-6">
            <h3 className="text-lg font-bold text-base-content">Profile Information</h3>
            {!isEditing ? (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  icon={<MdEdit />}
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  icon={<MdOutlineLockReset />}
                  onClick={() => setIsPasswordChangeModalOpen(true)}
                >
                  Change Password
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleSubmit}
                  loading={isLoading}
                >
                  Save Changes
                </Button>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-primary shadow-sm bg-base-200">
                <img
                  src={
                    profilePicPreview ||
                    user?.photo?.url ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>

              {isEditing && (
                <div
                  className="absolute bottom-1 right-1 p-2 rounded-xl bg-primary text-white shadow-md cursor-pointer hover:bg-primary/90 transition"
                  title="Change Photo"
                >
                  <label htmlFor="profilePic" className="cursor-pointer">
                    <MdOutlineAddAPhoto className="text-base" />
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

            <div className="space-y-4 w-full max-w-xl">
              <div>
                <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="input input-bordered w-full rounded-xl text-sm"
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="input input-bordered w-full rounded-xl text-sm opacity-70 cursor-not-allowed bg-base-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-base-content/70 uppercase mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input input-bordered w-full rounded-xl text-sm"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        </Card>
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

export default AdminSetting;
