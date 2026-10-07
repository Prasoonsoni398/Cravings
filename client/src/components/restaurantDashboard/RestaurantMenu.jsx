import React, { useState, useEffect } from "react";
import api from "../../config/ApiConfig";
import toast from "react-hot-toast";
import { FaAward } from "react-icons/fa";
import { BiSolidDish } from "react-icons/bi";
import { LuPencilLine, LuTrash2, LuEye, LuChevronDown } from "react-icons/lu";
import { AiTwotoneLike } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";
import ConfirmModal from "./menuItems/ConfirmModal";
import AddNewItemModal from "./menuItems/AddNewItemModal";
import EditOrViewItem from "./menuItems/EditOrViewItem";
import { Button, Badge, Card, EmptyState, SearchInput, LoadingSpinner } from "../ui";

const statusChipStyles = {
  available: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30",
  unavailable: "bg-amber-500/10 text-amber-600 border border-amber-500/30",
  discontinued: "bg-rose-500/10 text-rose-600 border border-rose-500/30",
};

const statusLabels = {
  available: "Available",
  unavailable: "Unavailable",
  discontinued: "Discontinued",
};

const RestaurantMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMenuItems = async () => {
    try {
      const response = await api.get("/restaurant/get-menu-items");
      setMenuItems(response.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch menu items", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const [isAddNewItemModalOpen, setIsAddNewItemModalOpen] = useState(false);
  const [isEditViewItemModalOpen, setIsEditViewItemModalOpen] = useState(false);
  const [isControlsModalOpen, setIsControlsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredItems = menuItems.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.itemName?.toLowerCase().includes(q) ||
      item.category?.toLowerCase().includes(q) ||
      item.foodType?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-base-content">Menu & Catalog Management</h2>
          <p className="text-xs text-base-content/60">
            Create items, adjust prices, and toggle in-stock availability.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <SearchInput
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            className="w-full sm:w-64"
          />
          <Button
            variant="primary"
            icon={<IoMdAddCircleOutline />}
            onClick={() => setIsAddNewItemModalOpen(true)}
            className="font-bold whitespace-nowrap"
          >
            Add New Dish
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-72 items-center justify-center">
          <LoadingSpinner size="lg" label="Loading menu items..." />
        </div>
      ) : filteredItems.length === 0 ? (
        <EmptyState
          icon={BiSolidDish}
          title={searchQuery ? "No matching dishes" : "No menu items yet"}
          description={
            searchQuery
              ? `No dishes matched "${searchQuery}". Try a different keyword.`
              : "Start by adding your first delicious dish to the restaurant catalog!"
          }
          action={
            <Button
              variant="primary"
              icon={<IoMdAddCircleOutline />}
              onClick={() => {
                if (searchQuery) setSearchQuery("");
                else setIsAddNewItemModalOpen(true);
              }}
            >
              {searchQuery ? "Clear Search" : "Add Dish Now"}
            </Button>
          }
        />
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="table w-full text-xs">
              <thead className="bg-base-200/50 text-base-content/70 uppercase">
                <tr>
                  <th className="py-3 px-4">Dish</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Badges</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200">
                {filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-base-200/30 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image?.url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100"}
                          alt={item.itemName}
                          className="w-12 h-12 object-cover rounded-xl border border-base-200 shrink-0"
                        />
                        <div>
                          <p className="font-extrabold text-sm text-base-content">
                            {item.itemName}
                          </p>
                          <p className="text-[11px] text-base-content/50 line-clamp-1 max-w-xs">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="font-bold text-base-content">{item.category}</span>
                        <Badge
                          variant={
                            item.foodType?.toLowerCase().includes("veg") && !item.foodType?.toLowerCase().includes("non")
                              ? "success"
                              : "error"
                          }
                          size="xs"
                        >
                          {item.foodType}
                        </Badge>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-black text-sm text-base-content">
                      ₹{Number(item.price).toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="relative inline-flex items-center">
                        <select
                          value={item.status}
                          className={`appearance-none rounded-lg pl-2.5 pr-7 py-1 text-xs font-bold transition cursor-pointer focus:outline-none ${
                            statusChipStyles[item.status] || "bg-base-200 text-base-content"
                          }`}
                          onChange={async (e) => {
                            const newStatus = e.target.value;
                            try {
                              await api.patch(
                                `/restaurant/update-menu-item-flags/${item._id}`,
                                { status: newStatus },
                              );
                              toast.success("Status updated");
                              fetchMenuItems();
                            } catch (error) {
                              toast.error("Failed to update status");
                            }
                          }}
                        >
                          <option value="available">{statusLabels.available}</option>
                          <option value="unavailable">{statusLabels.unavailable}</option>
                          <option value="discontinued">{statusLabels.discontinued}</option>
                        </select>
                        <LuChevronDown className="pointer-events-none absolute right-2 text-xs opacity-60" />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <Button
                          size="xs"
                          variant={item.isTopRated ? "warning" : "ghost"}
                          title={item.isTopRated ? "Top Rated" : "Mark as Top Rated"}
                          onClick={() => {
                            setSelectedItem(item);
                            setModalMode("topRated");
                            setIsControlsModalOpen(true);
                          }}
                        >
                          <FaAward />
                        </Button>
                        <Button
                          size="xs"
                          variant={item.isRecommended ? "primary" : "ghost"}
                          title={item.isRecommended ? "Recommended" : "Mark as Recommended"}
                          onClick={() => {
                            setSelectedItem(item);
                            setModalMode("recommended");
                            setIsControlsModalOpen(true);
                          }}
                        >
                          <AiTwotoneLike />
                        </Button>
                        <Button
                          size="xs"
                          variant={item.isNew ? "secondary" : "ghost"}
                          title={item.isNew ? "New Item" : "Mark as New"}
                          onClick={() => {
                            setSelectedItem(item);
                            setModalMode("new");
                            setIsControlsModalOpen(true);
                          }}
                        >
                          New
                        </Button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Button
                          size="xs"
                          variant="ghost"
                          title="Edit Item"
                          onClick={() => {
                            setSelectedItem(item);
                            setModalMode("edit");
                            setIsEditViewItemModalOpen(true);
                          }}
                        >
                          <LuPencilLine />
                        </Button>
                        <Button
                          size="xs"
                          variant="ghost"
                          title="View Item"
                          onClick={() => {
                            setSelectedItem(item);
                            setModalMode("view");
                            setIsEditViewItemModalOpen(true);
                          }}
                        >
                          <LuEye />
                        </Button>
                        <Button
                          size="xs"
                          variant="ghost"
                          className="text-error hover:bg-error/10"
                          title="Delete Item"
                          onClick={() => {
                            setSelectedItem(item);
                            setModalMode("delete");
                            setIsControlsModalOpen(true);
                          }}
                        >
                          <LuTrash2 />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>

      {isControlsModalOpen && (
        <ConfirmModal
          selectedItem={selectedItem}
          modalMode={modalMode}
          isOpen={isControlsModalOpen}
          onClose={() => setIsControlsModalOpen(false)}
          onSuccess={fetchMenuItems}
        />
      )}

      {isAddNewItemModalOpen && (
        <AddNewItemModal
          isOpen={isAddNewItemModalOpen}
          onClose={() => setIsAddNewItemModalOpen(false)}
          onSuccess={fetchMenuItems}
        />
      )}

      {isEditViewItemModalOpen && (
        <EditOrViewItem
          isOpen={isEditViewItemModalOpen}
          onClose={() => setIsEditViewItemModalOpen(false)}
          selectedItem={selectedItem}
          modalMode={modalMode}
          onSuccess={fetchMenuItems}
        />
      )}
    </>
  );
};

export default RestaurantMenu;
