import React, { useEffect, useState } from "react";
import api from "../../config/ApiConfig";
import { useCart } from "../../context/CartContext.jsx";
import {
  Button,
  SearchInput,
  FilterTabs,
  Badge,
  Card,
  EmptyState,
  LoadingSpinner,
} from "../ui";
import { FiPlus, FiShoppingCart, FiStar, FiFilter, FiCheck } from "react-icons/fi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const CATEGORIES = [
  { id: "all", label: "All Items" },
  { id: "main course", label: "Main Course" },
  { id: "starters", label: "Starters" },
  { id: "pizza", label: "Pizza" },
  { id: "burger", label: "Burgers" },
  { id: "biryani", label: "Biryani" },
  { id: "desserts", label: "Desserts" },
  { id: "beverages", label: "Beverages" },
];

const UserMenu = () => {
  const { cartItems, addToCart, openCart, totalItems } = useCart();
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [vegFilter, setVegFilter] = useState("all"); // "all", "veg", "non-veg"
  const [addedItems, setAddedItems] = useState({});

  const fetchDishes = async () => {
    try {
      setLoading(true);
      let url = "/public/dishes";
      const params = [];
      if (search) params.push(`search=${encodeURIComponent(search)}`);
      if (selectedCategory !== "all") params.push(`category=${encodeURIComponent(selectedCategory)}`);
      if (vegFilter === "veg") params.push("isVeg=true");
      if (vegFilter === "non-veg") params.push("isVeg=false");
      if (params.length) url += `?${params.join("&")}`;

      const res = await api.get(url);
      if (res.data?.success) {
        setDishes(res.data.data || []);
      }
    } catch (error) {
      console.error("Failed to load dishes:", error);
      toast.error("Failed to load menu dishes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDishes();
  }, [selectedCategory, vegFilter]);

  const handleAddToCart = (dish) => {
    const restaurantObj = dish.restaurant || {
      _id: "default_restaurant",
      restaurantName: "Cravings Kitchen",
    };

    addToCart(
      {
        _id: dish._id,
        name: dish.name,
        price: dish.price,
        image: dish.image,
      },
      restaurantObj
    );

    setAddedItems((prev) => ({ ...prev, [dish._id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [dish._id]: false }));
    }, 1500);

    toast.success(`Added ${dish.name} to cart!`, { duration: 2000 });
  };

  return (
    <div className="space-y-6">
      {/* Header & Cart Badge */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Badge variant="primary" size="xs">
            Live Kitchen Explorer
          </Badge>
          <h1 className="text-2xl font-black text-base-content mt-1">
            Browse Menu & Order Dishes
          </h1>
          <p className="text-xs text-base-content/60">
            Explore authentic dishes across top restaurants. Add fresh meals directly to your cart.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<FiShoppingCart />}
          onClick={openCart}
          className="self-start sm:self-auto shadow-md cursor-pointer"
        >
          View Cart ({totalItems})
        </Button>
      </div>

      {/* Search & Veg/Non-Veg Filter Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-base-200 bg-base-100 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={fetchDishes}
          onClear={() => {
            setSearch("");
            fetchDishes();
          }}
          placeholder="Search dishes (e.g. Butter Paneer, Pizza, Biryani)..."
          className="md:max-w-md"
        />

        <div className="flex items-center gap-1.5 self-start md:self-auto">
          <Button
            size="xs"
            variant={vegFilter === "all" ? "primary" : "ghost"}
            onClick={() => setVegFilter("all")}
          >
            All
          </Button>
          <Button
            size="xs"
            variant={vegFilter === "veg" ? "success" : "ghost"}
            onClick={() => setVegFilter("veg")}
          >
            🟢 Veg Only
          </Button>
          <Button
            size="xs"
            variant={vegFilter === "non-veg" ? "error" : "ghost"}
            onClick={() => setVegFilter("non-veg")}
          >
            🔴 Non-Veg
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <FilterTabs
        tabs={CATEGORIES}
        activeTab={selectedCategory}
        onSelectTab={setSelectedCategory}
      />

      {/* Dishes Grid */}
      {loading ? (
        <LoadingSpinner fullHeight label="Fetching fresh kitchen dishes..." />
      ) : !dishes.length ? (
        <EmptyState
          icon={FiShoppingCart}
          title="No dishes found"
          description="Try adjusting your search query, selecting another category, or resetting the veg filter."
          action={
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setSearch("");
                setSelectedCategory("all");
                setVegFilter("all");
              }}
            >
              Show All Items
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {dishes.map((dish) => {
            const isAdded = addedItems[dish._id];

            return (
              <Card
                key={dish._id}
                hoverEffect
                bodyClassName="p-4 flex flex-col justify-between h-full"
                className="group"
              >
                <div>
                  {/* Dish Image Container */}
                  <div className="relative h-44 w-full overflow-hidden rounded-xl bg-base-200">
                    <img
                      src={
                        dish.image?.url ||
                        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"
                      }
                      alt={dish.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Veg/Non-veg Dot Badge */}
                    <div className="absolute top-2.5 left-2.5">
                      <Badge
                        variant={dish.isVeg ? "success" : "error"}
                        size="xs"
                        className="font-bold backdrop-blur-md shadow-sm"
                      >
                        {dish.isVeg ? "VEG" : "NON-VEG"}
                      </Badge>
                    </div>

                    {dish.isRecommended && (
                      <div className="absolute top-2.5 right-2.5">
                        <Badge
                          variant="warning"
                          size="xs"
                          className="font-bold shadow-sm"
                        >
                          ★ Chef's Pick
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Dish Details */}
                  <div className="mt-3">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="font-extrabold text-sm text-base-content line-clamp-1 group-hover:text-primary transition-colors">
                        {dish.name}
                      </h3>
                      <span className="font-black text-sm text-primary shrink-0">
                        ₹{dish.price}
                      </span>
                    </div>

                    <p className="text-[11px] text-base-content/60 mt-1 line-clamp-2 leading-relaxed">
                      {dish.description || "Freshly cooked meal with exquisite spices and ingredients."}
                    </p>

                    <div className="mt-2 text-[10px] text-base-content/50 font-medium">
                      By: <span className="font-bold text-base-content/80">{dish.restaurant?.restaurantName || "Restaurant"}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="mt-4 pt-3 border-t border-base-200">
                  <Button
                    variant={isAdded ? "success" : "primary"}
                    size="xs"
                    fullWidth
                    icon={isAdded ? <FiCheck /> : <FiPlus />}
                    onClick={() => handleAddToCart(dish)}
                    className="shadow-xs"
                  >
                    {isAdded ? "Added to Cart!" : "Add to Cart"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserMenu;
