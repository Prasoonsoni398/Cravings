import { useEffect, useMemo, useState } from "react";
import {
  FaClock,
  FaMapMarkerAlt,
  FaStar,
  FaShoppingCart,
} from "react-icons/fa";
import api from "../config/ApiConfig";
import toast from "react-hot-toast";

const OrderNow = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await api.get("/public/restaurants");
        const restaurantList = res.data?.data || [];
        setRestaurants(restaurantList);
        setSelectedRestaurant(restaurantList[0] || null);
      } catch (error) {
        toast.error("Unable to load restaurants right now.");
      } finally {
        setIsLoadingRestaurants(false);
      }
    };

    fetchRestaurants();
  }, []);

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.qty * item.price, 0),
    [cartItems],
  );

  const addToCart = (itemName) => {
    const price = 120;
    setCartItems((prev) => {
      const exists = prev.find((item) => item.name === itemName);
      if (exists) {
        return prev.map((item) =>
          item.name === itemName ? { ...item, qty: item.qty + 1 } : item,
        );
      }
      return [...prev, { name: itemName, qty: 1, price }];
    });
    toast.success(`${itemName} added to cart`);
  };

  const decreaseQty = (name) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.name === name ? { ...item, qty: item.qty - 1 } : item,
        )
        .filter((item) => item.qty > 0),
    );
  };

  const removeItem = (name) => {
    setCartItems((prev) => prev.filter((item) => item.name !== name));
  };

  const handlePlaceOrder = async () => {
    if (!cartItems.length) {
      toast.error("Add items to cart first.");
      return;
    }
    if (!deliveryAddress.trim()) {
      toast.error("Enter a delivery address.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/orders", {
        restaurantId: selectedRestaurant.id,
        restaurantName: selectedRestaurant.name,
        items: cartItems,
        totalPrice: cartTotal,
        deliveryAddress,
      });
      toast.success("Order placed successfully!");
      setCartItems([]);
      setDeliveryAddress("");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to place order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-base-100">
      <section className="relative flex h-[40vh] items-center justify-center bg-[url('/commonBG.avif')] bg-cover bg-center text-center">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 px-6">
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">
            Order Now
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/80">
            Choose a restaurant, add tasty items to your cart, and place your
            order in seconds.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 xl:grid-cols-[2fr_1fr]">
          <div className="space-y-8">
            <div className="rounded-3xl bg-base-100 p-6 shadow-sm">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-(--color-neutral)">
                    Restaurants Near You
                  </h2>
                  <p className="mt-2 text-secondary">
                    Select a restaurant to view menu items and start ordering.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {restaurants.map((restaurant) => (
                    <button
                      key={restaurant.id}
                      onClick={() => setSelectedRestaurant(restaurant)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedRestaurant?.id === restaurant.id ? "bg-primary text-white" : "bg-base-200 text-(--color-neutral)"}`}
                    >
                      {restaurant.name}
                    </button>
                  ))}
                </div>
              </div>

              {isLoadingRestaurants ? (
                <div className="py-10 text-center text-secondary">
                  Loading restaurants...
                </div>
              ) : !selectedRestaurant ? (
                <div className="py-10 text-center text-secondary">
                  No restaurants available right now.
                </div>
              ) : (
                <div className="grid gap-6 lg:grid-cols-2">
                  <article className="overflow-hidden rounded-3xl border border-base-200">
                    <img
                      src={selectedRestaurant.image}
                      alt={selectedRestaurant.name}
                      className="h-60 w-full object-cover"
                    />
                    <div className="p-6">
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <h3 className="text-2xl font-bold text-(--color-neutral)">
                            {selectedRestaurant.name}
                          </h3>
                          <p className="text-sm text-secondary">
                            {selectedRestaurant.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 rounded-full bg-base-200 px-4 py-2 text-sm text-(--color-neutral)">
                          <FaStar className="text-primary" />{" "}
                          {selectedRestaurant.rating}
                        </div>
                      </div>
                      <div className="mb-4 grid grid-cols-2 gap-3 text-sm text-secondary">
                        <span className="flex items-center gap-2">
                          <FaClock /> {selectedRestaurant.deliveryTime}
                        </span>
                        <span className="flex items-center gap-2">
                          <FaMapMarkerAlt /> {selectedRestaurant.city}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedRestaurant.cuisines?.map((cuisine) => (
                          <span
                            key={cuisine}
                            className="rounded-full bg-base-200 px-3 py-1 text-xs text-(--color-neutral)"
                          >
                            {cuisine}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>

                  <article className="rounded-3xl border border-base-200 bg-base-100 p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-semibold text-(--color-neutral)">
                      Menu
                    </h3>
                    <div className="space-y-3">
                      {selectedRestaurant.menu?.map((item) => (
                        <div
                          key={item}
                          className="flex items-center justify-between rounded-3xl bg-base-100 px-4 py-3 shadow-sm"
                        >
                          <div>
                            <p className="font-semibold text-(--color-neutral)">
                              {item}
                            </p>
                            <p className="text-sm text-secondary">₹120</p>
                          </div>
                          <button
                            onClick={() => addToCart(item)}
                            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-focus"
                          >
                            Add
                          </button>
                        </div>
                      ))}
                    </div>
                  </article>
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-base-100 p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-(--color-neutral)">
                    Your Cart
                  </h2>
                  <p className="text-sm text-secondary">
                    Review your items before placing the order.
                  </p>
                </div>
                <FaShoppingCart className="text-2xl text-primary" />
              </div>

              {cartItems.length ? (
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.name}
                      className="rounded-3xl border border-base-200 bg-base-100 p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-(--color-neutral)">
                            {item.name}
                          </p>
                          <p className="text-sm text-secondary">
                            ₹{item.price} x {item.qty}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => decreaseQty(item.name)}
                            className="rounded-full border px-3 py-1 text-sm"
                          >
                            -
                          </button>
                          <span>{item.qty}</span>
                          <button
                            type="button"
                            onClick={() => addToCart(item.name)}
                            className="rounded-full border px-3 py-1 text-sm"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-sm text-secondary">
                        <span>Total</span>
                        <span>₹{item.price * item.qty}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.name)}
                        className="mt-3 text-sm font-semibold text-primary"
                      >
                        Remove
                      </button>
                    </div>
                  ))}

                  <div className="rounded-3xl bg-base-200 p-4">
                    <div className="flex items-center justify-between text-sm text-secondary">
                      <span>Subtotal</span>
                      <span>₹{cartTotal}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-secondary">
                  Your cart is empty. Add a menu item to begin.
                </p>
              )}

              <div className="mt-6 space-y-3">
                <label className="block text-sm font-medium text-(--color-neutral)">
                  Delivery Address
                </label>
                <input
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full rounded-3xl border border-base-200 bg-base-100 px-4 py-3 text-sm outline-none"
                  placeholder="Enter delivery address"
                />
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="mt-6 w-full rounded-3xl bg-primary px-6 py-4 text-sm font-semibold text-white transition hover:bg-primary-focus disabled:opacity-60"
              >
                {isSubmitting ? "Placing order..." : "Place Order"}
              </button>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default OrderNow;
