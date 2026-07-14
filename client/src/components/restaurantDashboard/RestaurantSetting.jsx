import React, { useState, useEffect } from "react";
import { MdEdit } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import api from "../../config/api.config";
import toast from "react-hot-toast";
import { MdOutlineAddAPhoto, MdOutlineLockReset } from "react-icons/md";
import PasswordChangeModal from "../commonModal/PasswordChangeModal";

const SectionCard = ({ title, description, action, children }) => (
  <div className="rounded-2xl border border-base-300 bg-base-100 shadow-sm">
    <div className="flex items-center justify-between gap-3 border-b border-base-300 px-5 py-4">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && (
          <p className="text-sm text-base-content/70">{description}</p>
        )}
      </div>
      {action}
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const RestaurantSetting = () => {
  const { user, setUser } = useAuth();
  const [isLoadingRestaurant, setIsLoadingRestaurant] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] =
    useState(false);

  const [editingRestaurant, setEditingRestaurant] = useState(false);

  const [coverImageFile, setCoverImageFile] = useState(null);
  const [restaurantImageFiles, setRestaurantImageFiles] = useState([]);

  const [socialMediaLinks, setSocialMediaLinks] = useState([
    {
      platform: "",
      url: "",
    },
  ]);

  const handleSocialChange = (index, field, value) => {
    const updated = [...socialMediaLinks];
    updated[index][field] = value;
    setSocialMediaLinks(updated);
  };

  const addSocialLink = () => {
    setSocialMediaLinks([
      ...socialMediaLinks,
      {
        platform: "",
        url: "",
      },
    ]);
  };

  const removeSocialLink = (index) => {
    const updated = socialMediaLinks.filter((_, i) => i !== index);
    setSocialMediaLinks(updated);
  };

  const [restaurantData, setRestaurantData] = useState({
    restaurantName: "",
    description: "",
    restaurantType: "both",

    address: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",

    latitude: "",
    longitude: "",

    legalName: "",
    companyType: "",
    gstCertificate: "",
    fssaiCertificate: "",
    panCard: "",

    bankName: "",
    accountNumber: "",
    ifscCode: "",

    email: "",
    phone: "",

    openingTime: "",
    closingTime: "",

    cuisineTypes: "",

    facebook: "",
    instagram: "",
    twitter: "",

    isOpen: false,
  });

  const handleRestaurantChange = (e) => {
    const { name, value, type, checked } = e.target;

    setRestaurantData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImageFile(file);
    }
  };

  const handleRestaurantImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setRestaurantImageFiles(files);
    }
  };

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  // Profile handlers
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);

      const payload = new FormData();
      payload.append("fullName", formData.fullName);
      payload.append("email", formData.email.toLowerCase());
      payload.append("phone", formData.phone);

      payload.append("displayPic", profilePic);

      const response = await api.put(`/user/edit-profile`, payload);

      setUser(response.data.data);
      sessionStorage.setItem("cravingUser", JSON.stringify(response.data.data));

      setEditingProfile(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRestaurant = async () => {
    try {
      setIsLoadingRestaurant(true);

      const payload = new FormData();
      payload.append("restaurantName", restaurantData.restaurantName || "");
      payload.append("description", restaurantData.description || "");
      payload.append("restaurantType", restaurantData.restaurantType || "both");
      payload.append("address", restaurantData.address || "");
      payload.append("city", restaurantData.city || "");
      payload.append("state", restaurantData.state || "");
      payload.append("pinCode", restaurantData.pinCode || "");
      payload.append("country", restaurantData.country || "");
      payload.append(
        "geoLocation",
        JSON.stringify({
          lat: restaurantData.latitude || "",
          lon: restaurantData.longitude || "",
        }),
      );
      payload.append(
        "documents",
        JSON.stringify({
          legalName: restaurantData.legalName || "",
          companyType: restaurantData.companyType || "",
          gstCertificate: restaurantData.gstCertificate || "",
          fssaiCertificate: restaurantData.fssaiCertificate || "",
          panCard: restaurantData.panCard || "",
        }),
      );
      payload.append(
        "financialDetails",
        JSON.stringify({
          bankName: restaurantData.bankName || "",
          accountNumber: restaurantData.accountNumber || "",
          ifscCode: restaurantData.ifscCode || "",
        }),
      );
      payload.append(
        "contactDetails",
        JSON.stringify({
          email: restaurantData.email || "",
          phone: restaurantData.phone || "",
        }),
      );
      payload.append(
        "servingHours",
        JSON.stringify({
          openingTime: restaurantData.openingTime || "",
          closingTime: restaurantData.closingTime || "",
        }),
      );
      payload.append(
        "cuisineTypes",
        JSON.stringify(
          (restaurantData.cuisineTypes || "")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        ),
      );
      payload.append("isOpen", String(restaurantData.isOpen));
      payload.append(
        "socialMediaLinks",
        JSON.stringify(
          socialMediaLinks.filter((item) => item.platform || item.url),
        ),
      );

      if (coverImageFile) {
        payload.append("coverImage", coverImageFile);
      }

      restaurantImageFiles.forEach((file) => {
        payload.append("restaurantImage", file);
      });

      const response = await api.put(`/restaurant/update-profile`, payload);

      setRestaurantData(response.data.data);
      setCoverImageFile(null);
      setRestaurantImageFiles([]);
      setEditingRestaurant(false);
      toast.success("Restaurant information updated successfully!");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to update restaurant information",
      );
    } finally {
      setIsLoadingRestaurant(false);
    }
  };

  const fetchRestaurantData = async () => {
    try {
      setIsLoadingRestaurant(true);

      const res = await api.get(
        `/restaurant/get-restaurant-data?id=${user?._id || user?._id}`,
      );

      const restaurant = res.data.data;

      setRestaurantData({
        ...restaurant,

        coverImage: restaurant.coverImage,
        restaurantImage: restaurant.restaurantImage,

        latitude: restaurant.geoLocation?.lat || "",
        longitude: restaurant.geoLocation?.lon || "",

        legalName: restaurant.documents?.legalName || "",
        companyType: restaurant.documents?.companyType || "",
        gstCertificate: restaurant.documents?.gstCertificate || "",
        fssaiCertificate: restaurant.documents?.fssaiCertificate || "",
        panCard: restaurant.documents?.panCard || "",

        bankName: restaurant.financialDetails?.bankName || "",
        accountNumber: restaurant.financialDetails?.accountNumber || "",
        ifscCode: restaurant.financialDetails?.ifscCode || "",

        email: restaurant.contactDetails?.email || "",
        phone: restaurant.contactDetails?.phone || "",

        openingTime: restaurant.servingHours?.openingTime || "",
        closingTime: restaurant.servingHours?.closingTime || "",

        cuisineTypes: restaurant.cuisineTypes?.join(", ") || "",
      });

      setSocialMediaLinks(
        restaurant.socialMediaLinks?.length
          ? restaurant.socialMediaLinks
          : [{ platform: "", url: "" }],
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unknown error occurred while fetching restaurant data.",
      );
    } finally {
      setIsLoadingRestaurant(false);
    }
  };

  useEffect(() => {
    fetchRestaurantData();
  }, []);

  const handleCancelProfile = () => {
    setFormData({
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
    setProfilePicPreview(null);
    setEditingProfile(false);
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfilePicPreview(URL.createObjectURL(file));
    setProfilePic(file);
  };

  return (
    <>
      <div className="h-full overflow-y-auto p-3 space-y-4 scrollbar-none m-3">
        <SectionCard
          title="Profile Information"
          description="Keep your personal details updated and manage your password securely."
          action={
            !editingProfile ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingProfile(true)}
                  className="flex items-center gap-2 rounded bg-primary px-3 py-1.5 text-sm font-medium text-primary-content"
                >
                  <MdEdit /> Edit
                </button>
                <button
                  onClick={() => setIsPasswordChangeModalOpen(true)}
                  className="flex items-center gap-2 rounded border border-primary px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary hover:text-primary-content"
                >
                  <MdOutlineLockReset /> Change Password
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSaveProfile}
                  className="rounded bg-primary px-3 py-1.5 text-sm font-medium text-primary-content"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={handleCancelProfile}
                  className="rounded bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-content"
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            )
          }
        >
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="flex flex-col items-center gap-3 lg:w-48">
              <div className="relative">
                <div className="h-32 w-32">
                  <img
                    src={profilePicPreview || user?.photo?.url || "https://placehold.co/200x200?text=Profile"}
                    alt="Profile"
                    className="h-full w-full rounded-full border-2 border-primary object-cover"
                  />
                </div>

                {editingProfile && (
                  <div className="absolute bottom-1 right-1 w-fit rounded-full border border-base-300 bg-base-100 p-2 shadow-sm" title="Change Photo">
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
              <p className="text-center text-sm text-base-content/70">
                Add a clear profile photo for a more professional look.
              </p>
            </div>

            <div className="flex-1 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleProfileChange}
                    className={`input input-bordered w-full ${editingProfile ? "" : "bg-base-200/70"}`}
                    disabled={!editingProfile}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleProfileChange}
                    className="input input-bordered w-full bg-base-200/70"
                    disabled={true}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleProfileChange}
                    className={`input input-bordered w-full ${editingProfile ? "" : "bg-base-200/70"}`}
                    disabled={!editingProfile}
                  />
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        {isLoadingRestaurant ? (
          <div className="flex h-32 items-center justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <SectionCard
            title="Restaurant Information"
            description="Share accurate restaurant details to help customers discover you."
            action={
              !editingRestaurant ? (
                <button
                  className="flex items-center gap-2 rounded bg-primary px-3 py-1.5 text-sm font-medium text-primary-content"
                  onClick={() => setEditingRestaurant(true)}
                >
                  <MdEdit /> Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    className="rounded bg-primary px-3 py-1.5 text-sm font-medium text-primary-content"
                    onClick={handleSaveRestaurant}
                    disabled={isLoadingRestaurant}
                  >
                    {isLoadingRestaurant ? "Saving..." : "Save"}
                  </button>

                  <button
                    className="rounded border border-base-300 px-3 py-1.5 text-sm font-medium"
                    onClick={() => setEditingRestaurant(false)}
                    disabled={isLoadingRestaurant}
                  >
                    Cancel
                  </button>
                </div>
              )
            }
          >
            <div className="space-y-6">
              <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-4">
                  <div className="rounded-2xl border border-base-300 bg-base-200/50 p-4">
                    <label className="mb-3 block text-sm font-semibold">Restaurant Images</label>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                      {restaurantData.restaurantImage?.map((image, index) => (
                        <img
                          key={index}
                          src={image.url}
                          alt=""
                          className="h-28 w-full rounded-lg object-cover"
                        />
                      ))}
                    </div>
                  </div>

                  {editingRestaurant && (
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold">
                        Upload New Restaurant Images
                      </label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleRestaurantImagesChange}
                        className="file-input file-input-bordered w-full"
                        disabled={!editingRestaurant}
                      />
                      {restaurantImageFiles.length > 0 && (
                        <div className="text-xs text-primary">
                          {restaurantImageFiles.length} image(s) selected
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-base-300 bg-base-200/50 p-4">
                    <label className="mb-3 block text-sm font-semibold">Cover Image</label>
                    {restaurantData.coverImage?.url ? (
                      <img
                        src={restaurantData.coverImage.url}
                        alt="Cover"
                        className="h-52 w-full rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-52 items-center justify-center rounded-lg border border-dashed border-base-300 bg-base-100 text-sm text-base-content/70">
                        No cover image added yet
                      </div>
                    )}
                  </div>

                  {editingRestaurant && (
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold">
                        Upload New Cover Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverImageChange}
                        className="file-input file-input-bordered w-full"
                        disabled={!editingRestaurant}
                      />
                      {coverImageFile && (
                        <div className="text-xs text-primary">
                          {coverImageFile.name} selected
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Restaurant Name</label>
                  <input
                    className={`input input-bordered w-full ${editingRestaurant ? "" : "bg-base-200/70"}`}
                    name="restaurantName"
                    value={restaurantData.restaurantName}
                    onChange={handleRestaurantChange}
                    disabled={!editingRestaurant}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Restaurant Type</label>
                  <select
                    className={`select select-bordered w-full ${editingRestaurant ? "" : "bg-base-200/70"}`}
                    name="restaurantType"
                    value={restaurantData.restaurantType}
                    onChange={handleRestaurantChange}
                    disabled={!editingRestaurant}
                  >
                    <option value="veg">Veg</option>
                    <option value="non-veg">Non Veg</option>
                    <option value="jain">Jain</option>
                    <option value="vegan">Vegan</option>
                    <option value="both">Both</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Address</label>
                  <input
                    className={`input input-bordered w-full ${editingRestaurant ? "" : "bg-base-200/70"}`}
                    name="address"
                    value={restaurantData.address}
                    onChange={handleRestaurantChange}
                    disabled={!editingRestaurant}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">City</label>
                  <input
                    className={`input input-bordered w-full ${editingRestaurant ? "" : "bg-base-200/70"}`}
                    name="city"
                    value={restaurantData.city}
                    onChange={handleRestaurantChange}
                    disabled={!editingRestaurant}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">State</label>
                  <input
                    className={`input input-bordered w-full ${editingRestaurant ? "" : "bg-base-200/70"}`}
                    name="state"
                    value={restaurantData.state}
                    onChange={handleRestaurantChange}
                    disabled={!editingRestaurant}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Pin Code</label>
                  <input
                    className={`input input-bordered w-full ${editingRestaurant ? "" : "bg-base-200/70"}`}
                    name="pinCode"
                    value={restaurantData.pinCode}
                    onChange={handleRestaurantChange}
                    disabled={!editingRestaurant}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Country</label>
                  <input
                    className={`input input-bordered w-full ${editingRestaurant ? "" : "bg-base-200/70"}`}
                    name="country"
                    value={restaurantData.country}
                    onChange={handleRestaurantChange}
                    disabled={!editingRestaurant}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Latitude</label>
                  <input
                    className={`input input-bordered w-full ${editingRestaurant ? "" : "bg-base-200/70"}`}
                    name="latitude"
                    value={restaurantData.latitude}
                    onChange={handleRestaurantChange}
                    disabled={!editingRestaurant}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Longitude</label>
                  <input
                    className={`input input-bordered w-full ${editingRestaurant ? "" : "bg-base-200/70"}`}
                    name="longitude"
                    value={restaurantData.longitude}
                    onChange={handleRestaurantChange}
                    disabled={!editingRestaurant}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Legal Name</label>
                  <input
                    className={`input input-bordered w-full ${editingRestaurant ? "" : "bg-base-200/70"}`}
                    name="legalName"
                    value={restaurantData.legalName}
                    onChange={handleRestaurantChange}
                    disabled={!editingRestaurant}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Type</label>
                  <input
                    className={`input input-bordered w-full ${editingRestaurant ? "" : "bg-base-200/70"}`}
                    name="companyType"
                    value={restaurantData.companyType}
                    onChange={handleRestaurantChange}
                    disabled={!editingRestaurant}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">GST Number</label>
                  <input
                    className={`input input-bordered w-full ${editingRestaurant ? "" : "bg-base-200/70"}`}
                    name="gstCertificate"
                    value={restaurantData.gstCertificate}
                    onChange={handleRestaurantChange}
                    disabled={!editingRestaurant}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">FSSAI Number</label>
                  <input
                    className={`input input-bordered w-full ${editingRestaurant ? "" : "bg-base-200/70"}`}
                    name="fssaiCertificate"
                    value={restaurantData.fssaiCertificate}
                    onChange={handleRestaurantChange}
                    disabled={!editingRestaurant}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">PAN Card</label>
                  <input
                    className={`input input-bordered w-full ${editingRestaurant ? "" : "bg-base-200/70"}`}
                    name="panCard"
                    value={restaurantData.panCard}
                    onChange={handleRestaurantChange}
                    disabled={!editingRestaurant}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Bank Name</label>
                  <input
                    className={`input input-bordered w-full ${editingRestaurant ? "" : "bg-base-200/70"}`}
                    name="bankName"
                    value={restaurantData.bankName}
                    onChange={handleRestaurantChange}
                    disabled={!editingRestaurant}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Account Number</label>
                  <input
                    className={`input input-bordered w-full ${editingRestaurant ? "" : "bg-base-200/70"}`}
                    name="accountNumber"
                    value={restaurantData.accountNumber}
                    onChange={handleRestaurantChange}
                    disabled={!editingRestaurant}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">IFSC Code</label>
                  <input
                    className={`input input-bordered w-full ${editingRestaurant ? "" : "bg-base-200/70"}`}
                    name="ifscCode"
                    value={restaurantData.ifscCode}
                    onChange={handleRestaurantChange}
                    disabled={!editingRestaurant}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Contact Email</label>
                  <input
                    className={`input input-bordered w-full ${editingRestaurant ? "" : "bg-base-200/70"}`}
                    name="email"
                    value={restaurantData.email}
                    onChange={handleRestaurantChange}
                    disabled={!editingRestaurant}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Contact Phone</label>
                  <input
                    className={`input input-bordered w-full ${editingRestaurant ? "" : "bg-base-200/70"}`}
                    name="phone"
                    value={restaurantData.phone}
                    onChange={handleRestaurantChange}
                    disabled={!editingRestaurant}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Opening Time</label>
                  <input
                    type="time"
                    className={`input input-bordered w-full ${editingRestaurant ? "" : "bg-base-200/70"}`}
                    name="openingTime"
                    value={restaurantData.openingTime}
                    onChange={handleRestaurantChange}
                    disabled={!editingRestaurant}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Closing Time</label>
                  <input
                    type="time"
                    className={`input input-bordered w-full ${editingRestaurant ? "" : "bg-base-200/70"}`}
                    name="closingTime"
                    value={restaurantData.closingTime}
                    onChange={handleRestaurantChange}
                    disabled={!editingRestaurant}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    className={`textarea textarea-bordered h-24 w-full ${editingRestaurant ? "" : "bg-base-200/70"}`}
                    name="description"
                    value={restaurantData.description}
                    onChange={handleRestaurantChange}
                    disabled={!editingRestaurant}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Cuisine Types</label>
                  <input
                    className={`input input-bordered w-full ${editingRestaurant ? "" : "bg-base-200/70"}`}
                    name="cuisineTypes"
                    placeholder="Indian, Chinese, Italian"
                    value={restaurantData.cuisineTypes}
                    onChange={handleRestaurantChange}
                    disabled={!editingRestaurant}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex cursor-pointer items-center justify-start gap-4 rounded-lg border border-base-300 bg-base-200/40 px-4 py-3">
                    <span className="font-semibold">Restaurant Open</span>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      name="isOpen"
                      checked={restaurantData.isOpen}
                      onChange={handleRestaurantChange}
                      disabled={!editingRestaurant}
                    />
                  </label>
                </div>
              </div>

              <div className="rounded-2xl border border-base-300 bg-base-200/40 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Social Media Links</h3>
                    <p className="text-sm text-base-content/70">
                      Add links that customers can use to reach you easily.
                    </p>
                  </div>

                  {editingRestaurant && (
                    <button
                      type="button"
                      onClick={addSocialLink}
                      className="rounded bg-primary px-3 py-1.5 text-sm font-medium text-primary-content"
                    >
                      + Add Link
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {socialMediaLinks.map((item, index) => (
                    <div key={index} className="grid gap-3 md:grid-cols-[1fr_1.5fr_auto]">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Platform</label>
                        <input
                          type="text"
                          className="input input-bordered w-full"
                          placeholder="Facebook"
                          value={item.platform}
                          disabled={!editingRestaurant}
                          onChange={(e) =>
                            handleSocialChange(index, "platform", e.target.value)
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Link</label>
                        <input
                          type="url"
                          className="input input-bordered w-full"
                          placeholder="https://facebook.com/restaurant"
                          value={item.url}
                          disabled={!editingRestaurant}
                          onChange={(e) =>
                            handleSocialChange(index, "url", e.target.value)
                          }
                        />
                      </div>

                      <div className="flex items-end">
                        {editingRestaurant && (
                          <button
                            type="button"
                            className="btn btn-error btn-outline w-full"
                            onClick={() => removeSocialLink(index)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>
        )}
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

export default RestaurantSetting;
