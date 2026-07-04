import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../config/api.config.js";
import { useAuth } from "../../context/AuthContext.jsx";

const Setting = () => {
  const { user, setUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);

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
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?._id) return;

    setIsLoading(true);

    try {
      const res = await api.put("/user/edit-profile", {
        email: user.email,
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
      });

      toast.success(res.data.message);

      sessionStorage.setItem(
        "UserData",
        JSON.stringify(res.data.data)
      );

      setUser(res.data.data);
      setIsEditing(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to update your profile."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-secondary">
        Please log in to view this section.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-8">
      <div className="card mx-auto max-w-3xl bg-base-100 shadow-xl">
        <div className="card-body">

          {/* Header */}

          <div className="mb-8 flex items-center gap-5">

            <div className="avatar">
              <div className="w-24 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                <img
                  src={
                    user.photo ||
                    "https://placehold.co/200x200?text=User"
                  }
                  alt={user.fullName}
                />
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-primary">
                Profile Settings
              </h2>

              <p className="text-secondary">
                Manage your profile information.
              </p>
            </div>

          </div>

          {isEditing ? (
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Name */}

              <div>
                <label className="label">
                  <span className="label-text font-semibold">
                    Full Name
                  </span>
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* Email */}

              <div>
                <label className="label">
                  <span className="label-text font-semibold">
                    Email Address
                  </span>
                </label>

                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="input input-bordered w-full"
                />
              </div>

              {/* Phone */}

              <div>
                <label className="label">
                  <span className="label-text font-semibold">
                    Phone Number
                  </span>
                </label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="flex gap-4">

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary"
                >
                  {isLoading
                    ? "Saving..."
                    : "Save Changes"}
                </button>

                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setIsEditing(false);

                    setFormData({
                      fullName: user.fullName || "",
                      phone: user.phone || "",
                    });
                  }}
                >
                  Cancel
                </button>

              </div>

            </form>
          ) : (
            <div className="space-y-5">

              <div className="flex justify-between border-b border-base-300 pb-3">
                <span className="font-semibold text-secondary">
                  Full Name
                </span>

                <span className="text-base-content">
                  {user.fullName}
                </span>
              </div>

              <div className="flex justify-between border-b border-base-300 pb-3">
                <span className="font-semibold text-secondary">
                  Email
                </span>

                <span className="text-base-content">
                  {user.email}
                </span>
              </div>

              <div className="flex justify-between border-b border-base-300 pb-3">
                <span className="font-semibold text-secondary">
                  Phone Number
                </span>

                <span className="text-base-content">
                  {user.phone}
                </span>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-primary mt-4"
              >
                Edit Profile
              </button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Setting;