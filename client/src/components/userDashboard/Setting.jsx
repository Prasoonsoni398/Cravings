import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../config/api.config.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";

const Setting = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        phone: user.phone || "",
        email: user.email || "",
      });
    }

    if (user?.photo) {
      setProfilePicPreview(user.photo);
    } else {
      setProfilePicPreview(null);
    }
  }, [user]);

  const handleProfilePicChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileURL = URL.createObjectURL(file);
    setProfilePicPreview(fileURL);

    const updatedUser = user ? { ...user, photo: fileURL } : { photo: fileURL };
    setUser(updatedUser);
    sessionStorage.setItem("UserData", JSON.stringify(updatedUser));
    toast.success("Profile photo updated locally.");
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
      const res = await api.put("/auth/profile", {
        userId: user._id,
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
      });

      toast.success(res.data.message);
      sessionStorage.setItem("UserData", JSON.stringify(res.data.data));
      setUser(res.data.data);
      setIsEditing(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to update your profile.",
      );
    } finally {
      setIsLoading(false);
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
    <div className="max-w-2xl rounded-xl border border-base-200 bg-primary-content p-6 shadow-md">
      <div className="mb-6 flex items-center gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-full">
          <img
            src={profilePicPreview || user.photo || "https://placehold.co/600x400?text=U"}
            alt={user.fullName || "User"}
            className="h-full w-full object-cover bg-amber-300"
          />
          <label
            htmlFor="profilePic"
            className="absolute bottom-1 right-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-white bg-base-200 shadow-md"
            title="Change Photo"
          >
            <MdOutlineAddPhotoAlternate className="text-sm" />
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
        <div>
          <h2 className="text-xl font-semibold">Profile Settings</h2>
          <p className="text-sm text-gray-500">
            Update your name and phone number.
          </p>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              name="phone"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 disabled:bg-gray-200 text-base-content"
              disabled
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2"
              required
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-md bg-amber-500 px-4 py-2 text-white disabled:opacity-60"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  fullName: user.fullName || "",
                  phone: user.phone || "",
                });
              }}
              className="rounded-md border px-4 py-2"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          <div>
            <span className="font-medium">Name:</span> {user.fullName}
          </div>
          <div>
            <span className="font-medium">Email:</span> {user.email}
          </div>
          <div>
            <span className="font-medium">Phone:</span> {user.phone}
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-md bg-primary px-4 py-2 text-white"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default Setting;
