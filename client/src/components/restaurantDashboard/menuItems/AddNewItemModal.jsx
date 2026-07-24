import React from "react";
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

const AddNewItemModal = ({ isOpen, onClose, onSuccess }) => {
  const [newItemFormData, setNewItemFormData] = React.useState({
    itemName: "",
    description: "",
    price: "",
    category: "",
    foodType: "",
    status: "available",
    isTopRated: false,
    isRecommended: false,
    isNew: true,
    isDeleted: false,
  });

  const [previewImage, setPreviewImage] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [itemImage, setItemImage] = React.useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewItemFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddNewItem = async () => {
    try {
      setIsLoading(true);
      console.log(newItemFormData);

      const formData = new FormData();
      formData.append("itemName", newItemFormData.itemName);
      formData.append("description", newItemFormData.description);
      formData.append("price", newItemFormData.price);
      formData.append("category", newItemFormData.category);
      formData.append("foodType", newItemFormData.foodType);
      formData.append("status", newItemFormData.status);
      formData.append("isTopRated", newItemFormData.isTopRated);
      formData.append("isRecommended", newItemFormData.isRecommended);
      formData.append("isNew", newItemFormData.isNew);
      formData.append("isDeleted", newItemFormData.isDeleted);

      if (itemImage) {
        formData.append("itemImage", itemImage);
      }

      const res = await api.post("/restaurant/add-menu-item", formData);
      toast.success(res.data.message);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unknown error occurred while adding the item. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleOnClose = () => {
    onClose();
  };

  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg w-4xl">
          <header className="flex justify-between items-center border-b border-(--color-secondary) pb-2 mb-4">
            <h2 className="text-lg font-semibold">Add New Item</h2>
            <button
              className="text-red-300 hover:text-red-500"
              onClick={handleOnClose}
            >
              <IoMdCloseCircleOutline size={24} />
            </button>
          </header>

          <main>
            <form className=" space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 space-x-0 space-y-2">
                  <label className="block mb-1 font-medium" htmlFor="itemImage">
                    Item Image
                  </label>
                  <div className="flex flex-col items-center justify-center w-full">
                    <label
                      htmlFor="itemImage"
                      className="flex flex-col items-center justify-center w-full h-52.5 border-2 border-dashed border-(--color-primary)/30 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 relative overflow-hidden"
                    >
                      {previewImage ? (
                        <>
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <span className="text-white font-medium">Change Image</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                          </svg>
                          <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
                          <p className="text-xs text-gray-500">PNG, JPG up to 1MB</p>
                        </div>
                      )}
                      <input
                        type="file"
                        id="itemImage"
                        name="itemImage"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            if (file.size > 5 * 1024 * 1024) {
                              toast.error("Image size must be less than 5MB");
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
                    <label
                      className="block mb-1 font-medium"
                      htmlFor="itemName"
                    >
                      Item Name
                    </label>
                    <input
                      type="text"
                      id="itemName"
                      name="itemName"
                      value={newItemFormData.itemName}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label
                      className="block mb-1 font-medium"
                      htmlFor="itemPrice"
                    >
                      Item Price
                    </label>
                    <input
                      type="number"
                      id="itemPrice"
                      name="price"
                      value={newItemFormData.price}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
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
                        value={newItemFormData.category}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-3 py-2  "
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
                        value={newItemFormData.foodType}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-3 py-2"
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
                    value={newItemFormData.description}
                    onChange={handleInputChange}
                    className=" w-full border h-20 resize-none focus:outline focus:outline-primary border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>
            </form>
          </main>

          <footer className="flex justify-between border-t border-(--color-secondary) pt-2 mt-4">
            <button
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
              onClick={handleOnClose}
            >
              Cancel
            </button>
            <button
              className="bg-(--color-primary) text-(--color-primary-content) px-4 py-2 rounded disabled:opacity-70 disabled:cursor-not-allowed"
              onClick={handleAddNewItem}
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Item"}
            </button>
          </footer>
        </div>
      </div>
    </>
  );
};

export default AddNewItemModal;
