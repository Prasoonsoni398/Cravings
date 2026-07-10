import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../config/api.config.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";

const Setting = () => {
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

      const res = await api.put("/auth/profile", uploadData, {
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
    <div className="max-w-2xl rounded-xl border border-base-200 bg-primary-content p-6 shadow-md">
      <div className="mb-6 flex items-center gap-4">
        <div className="relative">
          <div className=" h-53 w-45 overflow-hidden rounded-xl ">
          <img
            src={profilePicPreview || user?.photo?.url || user?.photo || "https://placehold.co/600x400?text=U"}
            alt={user.fullName || "User"}
            className="h-full w-full object-cover bg-amber-300"
          />
          {isEditing && (
            <>
              <label
                htmlFor="profilePic"
                className="absolute bottom-1 right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border  bg-base-200 shadow-md"
                title="Change Photo"
              >
                <MdOutlineAddPhotoAlternate className="text-xl" />
              </label>
              <input
                type="file"
                accept="image/*"
                name="displayPic"
                id="profilePic"
                className="hidden"
                onChange={handleProfilePicChange}
              />
            </>
          )}
        </div>
        </div>
        <div className="flex flex-col gap-5 w-full">
          <div className="border-b border-primary pb-4">
            <h2 className="text-xl font-semibold">Profile Settings</h2>
          <p className="text-sm text-gray-500">
            {isEditing
              ? "Choose a new photo to upload and save to your account."
              : "Update your profile photo from here."}
          </p>
          </div>
           {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4 ">


          <div className="grid gap-4">
            <div className="flex gap-2 items-center">
              <label className="mb-1 block text-sm font-medium">
                Name:
              </label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className=" flex flex-1 rounded-md border px-3 py-2 "
                required
              />
            </div >
            <div className="flex gap-2 items-center">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email:
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="flex flex-1 rounded-md border px-3 py-2 cursor-not-allowed bg-gray-300"
                disabled
              />
            </div>
            <div className="flex gap-2 items-center">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Phone:
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-md border px-3 py-2"
                required
              />
            </div>
            
          </div>

          <div className="flex flex-wrap justify-end items-center gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-md bg-primary px-4 py-2 text-white disabled:opacity-60"
            >
              {isLoading ? "Saving..." : "Save"}
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
            cblassName="rounded-md bg-primary px-4 py-1 justify-self-end flex text-white"
          >
            Edit
          </button>
          
        </div>
      )}
        </div>
        
      </div>

     
    </div>
  );
};

export default Setting;
