import { useState, useMemo } from "react";
import { FaMinus, FaPlus, FaTrash, FaCheckCircle, FaShoppingCart, FaCreditCard, FaMoneyBillWave } from "react-icons/fa";
import api from "../config/ApiConfig";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Cart = () => {
  const { cartItems, selectedRestaurant, addToCart, decreaseQty, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  const [addressDetails, setAddressDetails] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "Madhya Pradesh",
    pinCode: "",
    country: "India",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const billDetails = useMemo(() => {
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.qty * item.price,
      0,
    );
    const platformFee = 15;
    const convenienceFee = 10;
    const taxAmount = Math.round(totalAmount * 0.05); // 5% tax
    const deliveryCharge = totalAmount > 500 ? 0 : 40; // Free delivery over 500
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
      !addressDetails.phone ||
      !addressDetails.address ||
      !addressDetails.city ||
      !addressDetails.pinCode
    ) {
      toast.error("Please fill in all address and contact details.");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderItems = cartItems.map((item) => ({
        itemId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.qty,
        image: item.image?.url || "",
      }));

      const orderPayload = {
        restaurantId: selectedRestaurant._id,
        orderItems,
        billDetails,
        deliveryAddress: addressDetails,
        specialInstructions,
        paymentDetails: {
          paymentMethod,
          paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
        },
      };

      if (paymentMethod === "cod") {
        // Cash on delivery direct order
        await api.post("/orders", orderPayload);
        toast.success("Order placed successfully! Pay on delivery.");
        clearCart();
        navigate("/dashboard/user");
        return;
      }

      // Online payment flow via Razorpay
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error("Failed to load Razorpay SDK. Check your internet connection.");
        setIsSubmitting(false);
        return;
      }

      // 1. Create order in backend
      const orderRes = await api.post("/orders", orderPayload);
      const createdOrder = orderRes.data.data;

      // 2. Fetch Razorpay public Key ID
      const keyRes = await api.get("/payments/key");
      const razorpayKey = keyRes.data.keyId;

      // 3. Create Razorpay Order on server
      const rzpOrderRes = await api.post("/payments/create-order", {
        amount: billDetails.finalAmount,
        receipt: createdOrder._id,
      });

      const razorpayOrderData = rzpOrderRes.data.data;

      // 4. Open Razorpay payment gateway modal
      const options = {
        key: razorpayKey,
        amount: razorpayOrderData.amount,
        currency: razorpayOrderData.currency || "INR",
        name: "Cravings Food Delivery",
        description: `Order from ${selectedRestaurant?.restaurantName || "Restaurant"}`,
        order_id: razorpayOrderData.id,
        handler: async (response) => {
          try {
            await api.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: createdOrder._id,
            });
            toast.success("Payment successful! Order confirmed.");
            clearCart();
            navigate("/dashboard/user");
          } catch (verifyErr) {
            toast.error(
              verifyErr?.response?.data?.message || "Payment verification failed"
            );
          }
        },
        prefill: {
          name: addressDetails.name,
          contact: addressDetails.phone,
        },
        theme: {
          color: "#EA580C",
        },
        modal: {
          ondismiss: () => {
            toast("Payment window closed. Order is pending payment.");
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Order placement error:", error);
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
            <div className="py-12 text-center">
              <p className="text-base-content/60 mb-4">Your cart is currently empty.</p>
              <Link
                to="/"
                className="btn btn-primary btn-sm rounded-xl"
              >
                Explore Restaurants
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between gap-4 border-b border-base-200 pb-4"
                >
                  <div className="flex items-center gap-3">
                    {item.image?.url && (
                      <img
                        src={item.image.url}
                        alt={item.name}
                        className="h-16 w-16 rounded-xl object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-base-content">{item.name}</h3>
                      <p className="text-sm text-primary font-bold">₹{item.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decreaseQty(item._id)}
                      className="btn btn-circle btn-xs btn-outline"
                    >
                      <FaMinus />
                    </button>
                    <span className="font-semibold px-2">{item.qty}</span>
                    <button
                      onClick={() => addToCart(item, selectedRestaurant)}
                      className="btn btn-circle btn-xs btn-primary text-white"
                    >
                      <FaPlus />
                    </button>
                    <button
                      onClick={() => removeItem(item._id)}
                      className="btn btn-ghost btn-xs text-error ml-2"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <label className="text-xs font-semibold text-base-content/70 mb-1 block">
                  Cooking / Delivery Instructions (Optional)
                </label>
                <textarea
                  className="textarea textarea-bordered w-full text-sm rounded-xl"
                  placeholder="e.g. Less spicy, leave at the door..."
                  rows={2}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                />
              </div>

              <button
                onClick={clearCart}
                className="btn btn-ghost btn-sm text-error w-full mt-2"
              >
                Clear Cart
              </button>
            </div>
          )}
        </div>

        {/* Address and Checkout Section */}
        {cartItems.length > 0 && (
          <div className="rounded-3xl bg-base-100 p-6 shadow-md border border-base-200 h-fit">
            <h2 className="text-2xl font-extrabold text-base-content mb-4 border-b border-base-200 pb-3">
              Delivery Details
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Full Name *"
                  className="input input-sm input-bordered w-full"
                  value={addressDetails.name}
                  onChange={(e) =>
                    setAddressDetails({ ...addressDetails, name: e.target.value })
                  }
                />
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  className="input input-sm input-bordered w-full"
                  value={addressDetails.phone}
                  onChange={(e) =>
                    setAddressDetails({ ...addressDetails, phone: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Address / Flat / Street *"
                  className="input input-sm input-bordered w-full col-span-2"
                  value={addressDetails.address}
                  onChange={(e) =>
                    setAddressDetails({ ...addressDetails, address: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="City *"
                  className="input input-sm input-bordered w-full"
                  value={addressDetails.city}
                  onChange={(e) =>
                    setAddressDetails({ ...addressDetails, city: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Pin Code *"
                  className="input input-sm input-bordered w-full"
                  value={addressDetails.pinCode}
                  onChange={(e) =>
                    setAddressDetails({ ...addressDetails, pinCode: e.target.value })
                  }
                />
              </div>

              <h3 className="font-bold text-lg pt-2 border-t border-base-200">
                Payment Method
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <label
                  className={`flex flex-col items-center justify-center p-3 border rounded-xl cursor-pointer transition-all text-xs font-semibold gap-1 ${
                    paymentMethod === "card"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-base-300 hover:border-primary/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="hidden"
                  />
                  <FaCreditCard className="text-lg" />
                  Card
                </label>

                <label
                  className={`flex flex-col items-center justify-center p-3 border rounded-xl cursor-pointer transition-all text-xs font-semibold gap-1 ${
                    paymentMethod === "upi"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-base-300 hover:border-primary/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={() => setPaymentMethod("upi")}
                    className="hidden"
                  />
                  <span className="font-extrabold text-sm">UPI</span>
                  UPI / QR
                </label>

                <label
                  className={`flex flex-col items-center justify-center p-3 border rounded-xl cursor-pointer transition-all text-xs font-semibold gap-1 ${
                    paymentMethod === "cod"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-base-300 hover:border-primary/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="hidden"
                  />
                  <FaMoneyBillWave className="text-lg" />
                  Cash (COD)
                </label>
              </div>

              <h3 className="font-bold text-lg pt-2 border-t border-base-200">
                Bill Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-base-content/80">
                  <span>Item Total</span>
                  <span className="font-medium">₹{billDetails.totalAmount}</span>
                </div>
                <div className="flex justify-between text-base-content/80">
                  <span>Delivery Fee</span>
                  <span className="font-medium">
                    {billDetails.deliveryCharge === 0 ? (
                      <span className="text-success font-semibold">FREE</span>
                    ) : (
                      `₹${billDetails.deliveryCharge}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base-content/80">
                  <span>Taxes & Fees (5% + Plat.)</span>
                  <span className="font-medium">
                    ₹{billDetails.taxAmount + billDetails.platformFee + billDetails.convenienceFee}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg text-base-content pt-3 border-t border-base-200">
                  <span>To Pay</span>
                  <span className="text-primary font-extrabold">₹{billDetails.finalAmount}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-primary py-4 text-center font-bold text-white shadow-lg shadow-primary/30 transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <>
                    <FaCheckCircle /> {paymentMethod === "cod" ? "Place COD Order" : "Pay with Razorpay"} • ₹{billDetails.finalAmount}
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
