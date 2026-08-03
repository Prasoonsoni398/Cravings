import { useState, useMemo } from "react";
import { FaMinus, FaPlus, FaTrash, FaCheckCircle, FaShoppingCart } from "react-icons/fa";
import api from "../config/ApiConfig";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";

const Cart = () => {
  const { cartItems, selectedRestaurant, addToCart, decreaseQty, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

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
      clearCart();
      setAddressDetails({
        name: "",
        address: "",
        city: "",
        state: "",
        pinCode: "",
        country: "India",
      });
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to place order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-base-200 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-2">
        {/* Cart Items Section */}
        <div className="rounded-3xl bg-base-100 p-6 shadow-md border border-base-200 h-fit">
          <div className="mb-5 flex items-center justify-between border-b border-base-200 pb-4">
            <div>
              <h2 className="text-2xl font-extrabold text-base-content">
                Your Cart
              </h2>
              {selectedRestaurant && (
                <p className="text-sm text-base-content/60 mt-1">
                  Ordering from: {selectedRestaurant.restaurantName}
                </p>
              )}
            </div>
            <div className="p-3 bg-primary/10 rounded-2xl text-primary">
              <FaShoppingCart className="text-2xl" />
            </div>
          </div>

          {!cartItems.length ? (
            <div className="py-10 text-center">
              <p className="text-base-content/50 font-medium">
                Your cart is empty.
              </p>
              <p className="text-sm text-base-content/40 mt-1">
                Add items from the menu to get started.
              </p>
              <Link to="/ordernow" className="btn btn-primary mt-6">
                Browse Menu
              </Link>
            </div>
          ) : (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
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
                        onClick={() => addToCart(item, selectedRestaurant)}
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

        {/* Checkout Section */}
        {cartItems.length > 0 && (
          <div className="space-y-6 h-fit">
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
                    <FaCheckCircle /> Place Order • ₹{billDetails.finalAmount}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Cart;
