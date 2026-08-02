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

const OrderNow = () => {
  const location = useLocation();
  const passedRestaurantId = location.state?.restaurantId;

  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [isLoadingMenu, setIsLoadingMenu] = useState(false);

  const [cartItems, setCartItems] = useState([]);

  const [addressDetails, setAddressDetails] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    country: "India",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");

  const [isSubmitting, setIsSubmitting] = useState(false);
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
    // Clear cart when restaurant changes
    setCartItems([]);
  }, [selectedRestaurant]);

  const groupedMenu = useMemo(() => {
    return menuItems.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});
  }, [menuItems]);

  const billDetails = useMemo(() => {
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.qty * item.price,
      0,
    );
    const platformFee = 20;
    const convenienceFee = 10;
    const taxAmount = Math.round(totalAmount * 0.05); // 5% tax
    const deliveryCharge = 40;
    const discountAmount = 0;
    const finalAmount =
      totalAmount +
      platformFee +
      convenienceFee +
      taxAmount +
      deliveryCharge -
      discountAmount;

    return {
      totalAmount,
      platformFee,
      convenienceFee,
      taxAmount,
      deliveryCharge,
      discountAmount,
      finalAmount,
    };
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((prev) => {
      const exists = prev.find((i) => i._id === item._id);
      if (exists) {
        return prev.map((i) =>
          i._id === item._id ? { ...i, qty: i.qty + 1 } : i,
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
    toast.success(`${item.itemName} added to cart`);
  };

  const decreaseQty = (itemId) => {
    setCartItems((prev) =>
      prev
        .map((i) => (i._id === itemId ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0),
    );
  };

  const removeItem = (itemId) => {
    setCartItems((prev) => prev.filter((i) => i._id !== itemId));
  };

  const handlePlaceOrder = async () => {
    if (!cartItems.length) {
      toast.error("Add items to cart first.");
      return;
    }
    if (
      !addressDetails.name ||
      !addressDetails.address ||
      !addressDetails.city ||
      !addressDetails.pinCode
    ) {
      toast.error("Please fill in all address details.");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderItems = cartItems.map((item) => ({
        itemId: item._id,
        quantity: item.qty,
      }));

      await api.post("/orders", {
        restaurantId: selectedRestaurant._id,
        orderItems,
        billDetails,
        deliveryAddress: addressDetails,
        paymentDetails: {
          paymentMethod,
          paymentStatus: "pending",
        },
      });
      toast.success("Order placed successfully!");
      setCartItems([]);
      setAddressDetails({
        name: "",
        address: "",
        city: "",
        state: "",
        pinCode: "",
        country: "India",
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to place order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-base-200 relative">
      {/* Floating Cart Icon */}
      {cartItems.length > 0 && (
        <a 
          href="#cart-section" 
          className="fixed top-20 right-6 z-50 flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 font-bold text-primary-content shadow-lg transition hover:scale-105"
        >
          <FaShoppingCart className="text-xl" />
          <span className="bg-base-100 text-primary rounded-full px-2 py-0.5 text-xs">
            {cartItems.reduce((acc, item) => acc + item.qty, 0)}
          </span>
        </a>
      )}

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
        <div className="grid gap-8 lg:grid-cols-[2fr_1.2fr]">
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
                                onClick={() => addToCart(item)}
                                className="p-2 bg-white rounded-full shadow-sm text-primary hover:bg-primary hover:text-white transition-colors"
                              >
                                <FaPlus size={12} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addToCart(item)}
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

          {/* Sticky Cart & Checkout Sidebar */}
          <aside className="relative">
            <div className="sticky top-24 space-y-6">
              {/* Cart & Checkout Panel */}
              <div id="cart-section" className="rounded-3xl bg-base-100 p-6 shadow-md border border-base-200 h-fit sticky top-24">
                <div className="mb-5 flex items-center justify-between border-b border-base-200 pb-4">
                  <div>
                    <h2 className="text-2xl font-extrabold text-base-content">
                      Your Cart
                    </h2>
                    <p className="text-sm text-base-content/60 mt-1">
                      {selectedRestaurant?.restaurantName}
                    </p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                    <FaShoppingCart className="text-2xl" />
                  </div>
                </div>

                {!cartItems.length ? (
                  <div className="py-10 text-center">
                    <img
                      src="/empty-cart.png"
                      alt="Empty Cart"
                      className="w-32 mx-auto mb-4 opacity-50 grayscale hidden"
                    />
                    <p className="text-base-content/50 font-medium">
                      Your cart is empty.
                    </p>
                    <p className="text-sm text-base-content/40 mt-1">
                      Add items from the menu to get started.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                    {cartItems.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-start gap-2">
                          <div
                            className={`mt-1 w-3 h-3 flex shrink-0 items-center justify-center border rounded-sm ${item.foodType === "Vegetarian" ? "border-green-600" : "border-red-600"}`}
                          >
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${item.foodType === "Vegetarian" ? "bg-green-600" : "bg-red-600"}`}
                            ></div>
                          </div>
                          <div>
                            <p className="font-semibold text-base-content leading-tight">
                              {item.itemName}
                            </p>
                            <p className="text-sm font-medium text-base-content/70 mt-1">
                              ₹{item.price}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-3 bg-base-200 rounded-full px-2 py-1">
                            <button
                              onClick={() => decreaseQty(item._id)}
                              className="text-base-content/60 hover:text-error p-1"
                            >
                              <FaMinus size={10} />
                            </button>
                            <span className="font-bold text-sm w-3 text-center">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => addToCart(item)}
                              className="text-base-content/60 hover:text-primary p-1"
                            >
                              <FaPlus size={10} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item._id)}
                            className="text-base-content/30 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Delivery Address & Bill */}
              {cartItems.length > 0 && (
                <div className="rounded-3xl bg-base-100 p-6 shadow-md border border-base-200">
                  <h3 className="font-bold text-lg mb-4 border-b border-base-200 pb-2">
                    Delivery Details
                  </h3>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="input input-sm input-bordered w-full col-span-2"
                      value={addressDetails.name}
                      onChange={(e) =>
                        setAddressDetails({
                          ...addressDetails,
                          name: e.target.value,
                        })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Address / Flat No."
                      className="input input-sm input-bordered w-full col-span-2"
                      value={addressDetails.address}
                      onChange={(e) =>
                        setAddressDetails({
                          ...addressDetails,
                          address: e.target.value,
                        })
                      }
                    />
                    <input
                      type="text"
                      placeholder="City"
                      className="input input-sm input-bordered w-full"
                      value={addressDetails.city}
                      onChange={(e) =>
                        setAddressDetails({
                          ...addressDetails,
                          city: e.target.value,
                        })
                      }
                    />
                    <input
                      type="text"
                      placeholder="State"
                      className="input input-sm input-bordered w-full"
                      value={addressDetails.state}
                      onChange={(e) =>
                        setAddressDetails({
                          ...addressDetails,
                          state: e.target.value,
                        })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Pin Code"
                      className="input input-sm input-bordered w-full"
                      value={addressDetails.pinCode}
                      onChange={(e) =>
                        setAddressDetails({
                          ...addressDetails,
                          pinCode: e.target.value,
                        })
                      }
                    />
                  </div>

                  <h3 className="font-bold text-lg mb-4 border-b border-base-200 pb-2">
                    Payment
                  </h3>
                  <div className="flex gap-4 mb-6">
                    <label
                      className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-xl cursor-pointer transition-all ${paymentMethod === "card" ? "border-primary bg-primary/5 text-primary font-bold" : "border-base-300"}`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                        className="hidden"
                      />
                      Card
                    </label>
                    <label
                      className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-xl cursor-pointer transition-all ${paymentMethod === "upi" ? "border-primary bg-primary/5 text-primary font-bold" : "border-base-300"}`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="upi"
                        checked={paymentMethod === "upi"}
                        onChange={() => setPaymentMethod("upi")}
                        className="hidden"
                      />
                      UPI
                    </label>
                  </div>

                  <h3 className="font-bold text-lg mb-4 border-b border-base-200 pb-2">
                    Bill Summary
                  </h3>
                  <div className="space-y-2 text-sm mb-6">
                    <div className="flex justify-between text-base-content/80">
                      <span>Item Total</span>
                      <span className="font-medium">
                        ₹{billDetails.totalAmount}
                      </span>
                    </div>
                    <div className="flex justify-between text-base-content/80">
                      <span>Delivery Fee</span>
                      <span className="font-medium">
                        ₹{billDetails.deliveryCharge}
                      </span>
                    </div>
                    <div className="flex justify-between text-base-content/80">
                      <span>Taxes & Fees</span>
                      <span className="font-medium">
                        ₹
                        {billDetails.taxAmount +
                          billDetails.platformFee +
                          billDetails.convenienceFee}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-lg text-base-content pt-3 border-t border-base-200 mt-2">
                      <span>To Pay</span>
                      <span>₹{billDetails.finalAmount}</span>
                    </div>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className="w-full rounded-2xl bg-primary py-4 text-center font-bold text-white shadow-lg shadow-primary/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:bg-primary-focus disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      <>
                        <FaCheckCircle /> Place Order • ₹
                        {billDetails.finalAmount}
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default OrderNow;
