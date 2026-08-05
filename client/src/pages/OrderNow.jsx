import { useEffect, useMemo, useState } from "react";
import {
  FaClock,
  FaMapMarkerAlt,
  FaStar,
  FaShoppingCart,
  FaMinus,
  FaPlus,
  FaTrash,
  FaCheckCircle,
} from "react-icons/fa";
import api from "../config/ApiConfig";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

const OrderNow = () => {
  const location = useLocation();
  const { cartItems, addToCart, decreaseQty } = useCart();

  const passedRestaurantId = location.state?.restaurantId;

  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [isLoadingMenu, setIsLoadingMenu] = useState(false);
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await api.get("/public/restaurants");
        const restaurantList = res.data?.data || [];
        setRestaurants(restaurantList);
        if (restaurantList.length > 0) {
          if (passedRestaurantId) {
            const found = restaurantList.find(r => r._id === passedRestaurantId);
            setSelectedRestaurant(found || restaurantList[0]);
          } else {
            setSelectedRestaurant(restaurantList[0]);
          }
        }
      } catch (error) {
        toast.error("Unable to load restaurants right now.");
      } finally {
        setIsLoadingRestaurants(false);
      }
    };

    fetchRestaurants();
  }, [passedRestaurantId]);

  useEffect(() => {
    if (!selectedRestaurant) return;
    const fetchMenu = async () => {
      setIsLoadingMenu(true);
      try {
        const res = await api.get(
          `/public/restaurants/${selectedRestaurant._id}/menu`,
        );
        setMenuItems(res.data?.data || []);
      } catch (error) {
        toast.error("Unable to load menu for this restaurant.");
        setMenuItems([]);
      } finally {
        setIsLoadingMenu(false);
      }
    };
    fetchMenu();
  }, [selectedRestaurant]);

  const groupedMenu = useMemo(() => {
    return menuItems.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});
  }, [menuItems]);

  return (
    <main className="min-h-screen bg-base-200 relative">
      {/* Dynamic Hero Section */}
      <section className="relative flex h-[45vh] items-end justify-center bg-base-300">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{
            backgroundImage: `url('${selectedRestaurant?.coverImage?.url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80"}')`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        <div className="relative z-10 w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="mb-2 text-4xl font-extrabold text-white md:text-5xl drop-shadow-md">
                {selectedRestaurant
                  ? selectedRestaurant.restaurantName
                  : "Loading..."}
              </h1>
              {selectedRestaurant && (
                <div className="flex flex-wrap items-center gap-4 text-white/90">
                  <span className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-sm font-medium">
                    <FaStar className="text-yellow-400" />{" "}
                    {selectedRestaurant.averageRating || "New"}
                  </span>
                  <span className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-sm font-medium">
                    <FaClock /> {selectedRestaurant.servingHours?.openingTime} -{" "}
                    {selectedRestaurant.servingHours?.closingTime}
                  </span>
                  <span className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-sm font-medium">
                    <FaMapMarkerAlt /> {selectedRestaurant.city}
                  </span>
                </div>
              )}
            </div>


          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-1">
          {/* Main Menu Area */}
          <div className="space-y-10">
            {isLoadingMenu ? (
              <div className="py-20 text-center text-xl font-medium text-base-content/60">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="mt-4">Loading delicious menu...</p>
              </div>
            ) : Object.keys(groupedMenu).length === 0 ? (
              <div className="py-20 text-center text-xl font-medium text-base-content/60 bg-base-100 rounded-3xl shadow-sm border border-base-300">
                No menu items available for this restaurant yet.
              </div>
            ) : (
              Object.entries(groupedMenu).map(([category, items]) => (
                <div key={category} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-base-content mb-6 flex items-center gap-2">
                    {category}
                    <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full font-semibold">
                      {items.length} items
                    </span>
                  </h2>
                  <div className="grid gap-5 sm:grid-cols-2">
                    {items.map((item) => (
                      <article
                        key={item._id}
                        className="flex flex-col justify-between overflow-hidden rounded-3xl bg-base-100 p-5 shadow-sm border border-base-200 transition-all hover:shadow-md hover:border-primary/30"
                      >
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {/* Veg / Non-veg indicator */}
                              <div
                                className={`w-4 h-4 flex items-center justify-center border-2 rounded-sm ${item.foodType === "Vegetarian" ? "border-green-600" : "border-red-600"}`}
                              >
                                <div
                                  className={`w-2 h-2 rounded-full ${item.foodType === "Vegetarian" ? "bg-green-600" : "bg-red-600"}`}
                                ></div>
                              </div>
                              {item.isTopRated && (
                                <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">
                                  Bestseller
                                </span>
                              )}
                            </div>
                            <h3 className="font-bold text-lg text-base-content leading-tight mb-1">
                              {item.itemName}
                            </h3>
                            <p className="font-semibold text-base-content/80 mb-2">
                              ₹{item.price}
                            </p>
                            <p className="text-sm text-base-content/60 line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                          {item.image?.url && (
                            <div className="relative shrink-0">
                              <img
                                src={item.image.url}
                                alt={item.itemName}
                                className="h-28 w-28 rounded-2xl object-cover shadow-sm"
                              />
                            </div>
                          )}
                        </div>
                        <div className="mt-4 flex justify-end">
                          {cartItems.find((i) => i._id === item._id) ? (
                            <div className="flex items-center gap-3 bg-base-200 rounded-full px-2 py-1 shadow-inner">
                              <button
                                onClick={() => decreaseQty(item._id)}
                                className="p-2 bg-white rounded-full shadow-sm text-error hover:bg-error hover:text-white transition-colors"
                              >
                                <FaMinus size={12} />
                              </button>
                              <span className="font-bold w-4 text-center">
                                {cartItems.find((i) => i._id === item._id).qty}
                              </span>
                              <button
                                onClick={() => addToCart(item, selectedRestaurant)}
                                className="p-2 bg-white rounded-full shadow-sm text-primary hover:bg-primary hover:text-white transition-colors"
                              >
                                <FaPlus size={12} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addToCart(item, selectedRestaurant)}
                              className="rounded-full bg-primary/10 text-primary font-bold px-6 py-2 hover:bg-primary hover:text-white transition-colors"
                            >
                              ADD
                            </button>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default OrderNow;
