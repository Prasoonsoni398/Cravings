import React, { useEffect } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import api from "../../../config/ApiConfig";
import toast from "react-hot-toast";

const itemCategories = [
  "Appetizer",
  "Main Course",
  "Dessert",
  "Beverage",
  "Salad",
  "Soup",
  "Side Dish",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snack",
  "Pizza",
  "Pasta",
  "Burger",
  "Sandwich",
  "Seafood",
  "Rice",
  "Wrap",
  "Starter",
  "Drink",
  "Other",
];

const foodTypes = [
  "Vegetarian",
  "Non-Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Egg-Free",
  "Other",
];

const EditOrViewItem = ({ isOpen, onClose, selectedItem, modalMode, onSuccess }) => {
  const [formData, setFormData] = React.useState({
    itemName: "",
    description: "",
    price: "",
    category: "",
    foodType: "",
    status: "available",
  });

  const [previewImage, setPreviewImage] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [itemImage, setItemImage] = React.useState(null);

  useEffect(() => {
    if (selectedItem) {
      setFormData({
        itemName: selectedItem.itemName || "",
        description: selectedItem.description || "",
        price: selectedItem.price || "",
        category: selectedItem.category || "",
        foodType: selectedItem.foodType || "",
        status: selectedItem.status || "available",
      });
      if (selectedItem.image && selectedItem.image.url) {
        setPreviewImage(selectedItem.image.url);
      }
    }
  }, [selectedItem]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateItem = async () => {
    try {
      setIsLoading(true);
      
      const payload = new FormData();
      payload.append("itemName", formData.itemName);
      payload.append("description", formData.description);
      payload.append("price", formData.price);
      payload.append("category", formData.category);
      payload.append("foodType", formData.foodType);
      payload.append("status", formData.status);
      
      if (itemImage) {
        payload.append("itemImage", itemImage);
      }

      const res = await api.put(`/restaurant/edit-menu-item/${selectedItem._id}`, payload);
      toast.success(res.data.message);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error updating item. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const isViewMode = modalMode === "view";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-4xl">
        <header className="flex justify-between items-center border-b border-(--color-secondary) pb-2 mb-4">
          <h2 className="text-lg font-semibold">
            {isViewMode ? "View Item" : "Edit Item"}
          </h2>
          <button className="text-red-300 hover:text-red-500" onClick={onClose}>
            <IoMdCloseCircleOutline size={24} />
          </button>
        </header>

        <main>
          <form className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1 space-x-0 space-y-2">
                <label className="block mb-1 font-medium" htmlFor="itemImage">
                  Item Image
                </label>
                <div className="flex flex-col items-center justify-center w-full">
                  <label
                    htmlFor="itemImage"
                    className={`flex flex-col items-center justify-center w-full h-52.5 border-2 border-dashed border-(--color-primary)/30 rounded-lg bg-gray-50 relative overflow-hidden ${isViewMode ? "cursor-default" : "cursor-pointer hover:bg-gray-100"}`}
                  >
                    {previewImage ? (
                      <>
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        {!isViewMode && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <span className="text-white font-medium">
                              Change Image
                            </span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-gray-500"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        {!isViewMode && (
                          <>
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">
                                Click to upload
                              </span>
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG up to 1MB
                            </p>
                          </>
                        )}
                      </div>
                    )}
                    <input
                      type="file"
                      id="itemImage"
                      name="itemImage"
                      accept="image/*"
                      className="hidden"
                      disabled={isViewMode}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          if (file.size > 1 * 1024 * 1024) {
                            toast.error("Image size must be less than 1MB");
                            e.target.value = "";
                            return;
                          }
                          setItemImage(file);
                          setPreviewImage(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
              <div className="space-y-4 col-span-2">
                <div>
                  <label className="block mb-1 font-medium" htmlFor="itemName">
                    Item Name
                  </label>
                  <input
                    type="text"
                    id="itemName"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    className="w-full border border-gray-300 rounded px-3 py-2 disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium" htmlFor="itemPrice">
                    Item Price
                  </label>
                  <input
                    type="number"
                    id="itemPrice"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    className="w-full border border-gray-300 rounded px-3 py-2 disabled:bg-gray-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block mb-1 font-medium"
                      htmlFor="itemCategory"
                    >
                      Item Category
                    </label>
                    <select
                      id="itemCategory"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      disabled={isViewMode}
                      className="w-full border border-gray-300 rounded px-3 py-2 disabled:bg-gray-100"
                    >
                      <option value="" className="capitalize">
                        Select Category
                      </option>
                      {itemCategories.map((category, idx) => (
                        <option
                          key={idx}
                          value={category}
                          className="capitalize"
                        >
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      className="block mb-1 font-medium"
                      htmlFor="itemType"
                    >
                      Food Type
                    </label>
                    <select
                      id="itemType"
                      name="foodType"
                      value={formData.foodType}
                      onChange={handleInputChange}
                      disabled={isViewMode}
                      className="w-full border border-gray-300 rounded px-3 py-2 disabled:bg-gray-100"
                    >
                      <option value="" className="capitalize">
                        Select Food Type
                      </option>
                      {foodTypes.map((type, idx) => (
                        <option key={idx} value={type} className="capitalize">
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-span-3">
                <label
                  className="block mb-1 font-medium"
                  htmlFor="itemDescription"
                >
                  Item Description
                </label>
                <textarea
                  id="itemDescription"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={isViewMode}
                  className="w-full border h-20 resize-none focus:outline focus:outline-primary border-gray-300 rounded px-3 py-2 disabled:bg-gray-100"
                />
              </div>
            </div>
          </form>
        </main>

        <footer className="flex justify-between border-t border-(--color-secondary) pt-2 mt-4">
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
            onClick={onClose}
          >
            {isViewMode ? "Close" : "Cancel"}
          </button>
          {!isViewMode && (
            <button
              className="bg-(--color-primary) text-(--color-primary-content) px-4 py-2 rounded"
              onClick={handleUpdateItem}
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Item"}
            </button>
          )}
        </footer>
      </div>
    </div>
  );
};

export default EditOrViewItem;
