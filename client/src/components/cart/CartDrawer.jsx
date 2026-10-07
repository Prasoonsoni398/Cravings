import { useState, useMemo, useEffect } from "react";
import {
  FaMinus,
  FaPlus,
  FaTrash,
  FaCheckCircle,
  FaShoppingCart,
  FaCreditCard,
  FaMoneyBillWave,
  FaArrowLeft,
  FaStore,
  FaShieldAlt,
  FaReceipt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../config/ApiConfig";
import toast from "react-hot-toast";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { Drawer, Button, Badge, EmptyState } from "../ui";

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

const CartDrawer = () => {
  const {
    cartItems,
    selectedRestaurant,
    addToCart,
    decreaseQty,
    removeItem,
    clearCart,
    isCartOpen,
    closeCart,
    totalItems,
  } = useCart();

  const { user, isLogin } = useAuth();
  const navigate = useNavigate();

  // Step: "items" (review list) | "checkout" (address & payment)
  const [checkoutStep, setCheckoutStep] = useState("items");

  const [addressDetails, setAddressDetails] = useState({
    name: "",
    phone: "",
    address: "",
    city: "Bhopal",
    state: "Madhya Pradesh",
    pinCode: "",
    country: "India",
  });

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill user details if logged in
  useEffect(() => {
    if (user) {
      setAddressDetails((prev) => ({
        ...prev,
        name: prev.name || user.fullName || "",
        phone: prev.phone || user.phone || "",
      }));
    }
  }, [user]);

  // Reset checkout step when cart becomes empty or closes
  useEffect(() => {
    if (!isCartOpen) {
      // delay reset slightly for smooth exit transition
      const timer = setTimeout(() => setCheckoutStep("items"), 300);
      return () => clearTimeout(timer);
    }
  }, [isCartOpen]);

  const billDetails = useMemo(() => {
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.qty * item.price,
      0,
    );
    const platformFee = 15;
    const convenienceFee = 10;
    const taxAmount = Math.round(totalAmount * 0.05); // 5% GST
    const deliveryCharge = totalAmount > 500 ? 0 : 40; // Free delivery over ₹500
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

  const handleProceedToAddress = () => {
    if (!cartItems.length) {
      toast.error("Your cart is empty.");
      return;
    }
    setCheckoutStep("checkout");
  };

  const handlePlaceOrder = async () => {
    if (!cartItems.length) {
      toast.error("Add items to cart first.");
      return;
    }

    if (
      !addressDetails.name.trim() ||
      !addressDetails.phone.trim() ||
      !addressDetails.address.trim() ||
      !addressDetails.city.trim() ||
      !addressDetails.pinCode.trim()
    ) {
      toast.error("Please fill in all address and contact details.");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderItems = cartItems.map((item) => ({
        itemId: item._id,
        name: item.name || item.itemName,
        price: item.price,
        quantity: item.qty,
        image: item.image?.url || "",
      }));

      const orderPayload = {
        restaurantId: selectedRestaurant?._id,
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
        await api.post("/orders", orderPayload);
        toast.success("Order placed successfully! Pay with cash on delivery.");
        clearCart();
        closeCart();
        navigate(isLogin ? "/user/dashboard/order" : "/login");
        return;
      }

      // Online payment via Razorpay
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error("Failed to load Razorpay SDK. Check your internet connection.");
        setIsSubmitting(false);
        return;
      }

      // 1. Create order on backend
      const orderRes = await api.post("/orders", orderPayload);
      const createdOrder = orderRes.data?.data;

      // 2. Fetch Razorpay public Key ID
      const keyRes = await api.get("/payments/key");
      const razorpayKey = keyRes.data?.keyId;

      // 3. Create Razorpay Order on server
      const rzpOrderRes = await api.post("/payments/create-order", {
        amount: billDetails.finalAmount,
        receipt: createdOrder._id,
      });

      const razorpayOrderData = rzpOrderRes.data?.data;

      // 4. Open Razorpay payment gateway
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
            toast.success("Payment verified! Order confirmed.");
            clearCart();
            closeCart();
            navigate(isLogin ? "/user/dashboard/order" : "/login");
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
            toast("Payment dismissed. Order is saved as pending.");
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
    <Drawer
      isOpen={isCartOpen}
      onClose={closeCart}
      maxWidth="md"
      position="right"
      title={
        <div className="flex items-center gap-2">
          {checkoutStep === "checkout" && (
            <button
              onClick={() => setCheckoutStep("items")}
              className="p-1 hover:bg-base-200 rounded-lg text-base-content/70 hover:text-base-content cursor-pointer mr-1"
              title="Back to items"
              aria-label="Back to items"
            >
              <FaArrowLeft className="w-4 h-4" />
            </button>
          )}
          <span className="flex items-center gap-2">
            <FaShoppingCart className="text-primary text-lg" />
            {checkoutStep === "items" ? "Your Cart" : "Checkout & Delivery"}
          </span>
        </div>
      }
      subtitle={
        selectedRestaurant ? (
          <span className="flex items-center gap-1.5 text-xs text-base-content/70">
            <FaStore className="text-primary/80 shrink-0" />
            <span className="font-semibold text-base-content truncate">
              {selectedRestaurant.restaurantName}
            </span>
            {selectedRestaurant.location && (
              <span className="text-base-content/50">
                • {selectedRestaurant.location}
              </span>
            )}
          </span>
        ) : (
          "Fresh meals delivered directly to your doorstep"
        )
      }
      badge={
        <Badge variant="primary" size="xs">
          {totalItems} {totalItems === 1 ? "Item" : "Items"}
        </Badge>
      }
      footer={
        cartItems.length > 0 && (
          <div className="space-y-3">
            {/* Bill Summary Breakdown */}
            <div className="bg-base-200/60 rounded-2xl p-3.5 space-y-1.5 text-xs border border-base-200">
              <div className="flex justify-between text-base-content/80">
                <span>Subtotal ({totalItems} items)</span>
                <span className="font-semibold">₹{billDetails.totalAmount}</span>
              </div>
              <div className="flex justify-between text-base-content/80">
                <span>Delivery Fee</span>
                <span className="font-semibold">
                  {billDetails.deliveryCharge === 0 ? (
                    <span className="text-success font-bold">FREE</span>
                  ) : (
                    `₹${billDetails.deliveryCharge}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base-content/80">
                <span>GST & Platform Charges</span>
                <span className="font-semibold">
                  ₹{billDetails.taxAmount + billDetails.platformFee + billDetails.convenienceFee}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-base-content pt-2 border-t border-base-300">
                <span>Total Amount</span>
                <span className="text-primary text-base font-black">
                  ₹{billDetails.finalAmount}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            {checkoutStep === "items" ? (
              <Button
                variant="primary"
                size="md"
                className="w-full shadow-lg shadow-primary/25 cursor-pointer font-bold justify-between text-sm"
                onClick={handleProceedToAddress}
              >
                <span>Proceed to Checkout</span>
                <span>₹{billDetails.finalAmount} →</span>
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                loading={isSubmitting}
                className="w-full shadow-lg shadow-primary/25 cursor-pointer font-bold text-sm"
                icon={<FaCheckCircle />}
                onClick={handlePlaceOrder}
              >
                {paymentMethod === "cod"
                  ? `Place COD Order (₹${billDetails.finalAmount})`
                  : `Pay with Razorpay (₹${billDetails.finalAmount})`}
              </Button>
            )}

            <div className="flex items-center justify-between text-[11px] text-base-content/60 px-1">
              <span className="flex items-center gap-1">
                <FaShieldAlt className="text-success" /> 100% Secure Checkout
              </span>
              <button
                type="button"
                onClick={clearCart}
                className="text-error hover:underline cursor-pointer"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )
      }
    >
      {/* Drawer Body Content */}
      {cartItems.length === 0 ? (
        <div className="py-12 px-4 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center text-3xl mb-4 shadow-inner">
            <FaShoppingCart />
          </div>
          <h3 className="text-lg font-black text-base-content mb-1">
            Your Cart is Empty
          </h3>
          <p className="text-xs text-base-content/60 max-w-xs mb-6">
            Explore delectable food dishes from your favorite local restaurants and add them to your cart.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              closeCart();
              navigate("/order-now");
            }}
          >
            Explore Menu Now
          </Button>
        </div>
      ) : checkoutStep === "items" ? (
        /* View 1: Cart Items List */
        <div className="space-y-4">
          {/* Items List */}
          <div className="divide-y divide-base-200">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 group"
              >
                {/* Item Thumbnail & Details */}
                <div className="flex items-center gap-3 min-w-0">
                  {item.image?.url ? (
                    <img
                      src={item.image.url}
                      alt={item.name || item.itemName}
                      className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-base-200 shadow-xs"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-base-200 flex items-center justify-center shrink-0 text-base-content/40 text-xs font-bold">
                      Food
                    </div>
                  )}
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-base-content truncate">
                      {item.name || item.itemName}
                    </h4>
                    <p className="text-xs text-primary font-bold mt-0.5">
                      ₹{item.price} each
                    </p>
                  </div>
                </div>

                {/* Counter & Action */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1.5 bg-base-200 rounded-xl p-1 border border-base-300">
                    <button
                      type="button"
                      onClick={() => decreaseQty(item._id)}
                      className="w-6 h-6 rounded-lg bg-base-100 hover:bg-base-300 flex items-center justify-center text-xs text-base-content transition-colors cursor-pointer"
                      title="Decrease quantity"
                      aria-label="Decrease quantity"
                    >
                      <FaMinus size={9} />
                    </button>
                    <span className="w-5 text-center text-xs font-black text-base-content">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => addToCart(item, selectedRestaurant)}
                      className="w-6 h-6 rounded-lg bg-primary hover:bg-primary/90 text-white flex items-center justify-center text-xs transition-colors cursor-pointer shadow-xs"
                      title="Increase quantity"
                      aria-label="Increase quantity"
                    >
                      <FaPlus size={9} />
                    </button>
                  </div>

                  <span className="text-xs font-black text-base-content w-12 text-right">
                    ₹{item.price * item.qty}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeItem(item._id)}
                    className="p-1.5 text-base-content/40 hover:text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
                    title="Remove item"
                    aria-label="Remove item"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cooking / Delivery Instructions Input */}
          <div className="pt-2">
            <label className="text-xs font-bold text-base-content/80 mb-1.5 flex items-center gap-1.5">
              <span>✍️</span> Cooking / Delivery Instructions
            </label>
            <textarea
              className="textarea textarea-bordered w-full text-xs rounded-2xl bg-base-100 focus:border-primary"
              placeholder="e.g. Please make it less spicy, leave at security gate..."
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
            />
          </div>
        </div>
      ) : (
        /* View 2: Delivery Details & Payment Method */
        <div className="space-y-4">
          <div className="rounded-2xl bg-base-200/50 p-4 border border-base-200 space-y-3">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-base-content/70">
              Delivery Address & Contact
            </h4>
            <div className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-base-content/70 mb-1 block">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="input input-sm input-bordered w-full rounded-xl text-xs"
                    value={addressDetails.name}
                    onChange={(e) =>
                      setAddressDetails({ ...addressDetails, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-base-content/70 mb-1 block">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="input input-sm input-bordered w-full rounded-xl text-xs"
                    value={addressDetails.phone}
                    onChange={(e) =>
                      setAddressDetails({ ...addressDetails, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-base-content/70 mb-1 block">
                  Flat / House / Street Address *
                </label>
                <input
                  type="text"
                  placeholder="Flat 402, Green Avenue, Gulmohar"
                  className="input input-sm input-bordered w-full rounded-xl text-xs"
                  value={addressDetails.address}
                  onChange={(e) =>
                    setAddressDetails({ ...addressDetails, address: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-base-content/70 mb-1 block">
                    City *
                  </label>
                  <input
                    type="text"
                    placeholder="Bhopal"
                    className="input input-sm input-bordered w-full rounded-xl text-xs"
                    value={addressDetails.city}
                    onChange={(e) =>
                      setAddressDetails({ ...addressDetails, city: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-base-content/70 mb-1 block">
                    Pin Code *
                  </label>
                  <input
                    type="text"
                    placeholder="462001"
                    className="input input-sm input-bordered w-full rounded-xl text-xs"
                    value={addressDetails.pinCode}
                    onChange={(e) =>
                      setAddressDetails({ ...addressDetails, pinCode: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="rounded-2xl bg-base-200/50 p-4 border border-base-200 space-y-2.5">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-base-content/70">
              Select Payment Method
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  paymentMethod === "card"
                    ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                    : "border-base-300 bg-base-100 text-base-content/80 hover:border-primary/40"
                }`}
              >
                <FaCreditCard className="text-base mb-1" />
                <span className="text-[11px] leading-tight">Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("upi")}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  paymentMethod === "upi"
                    ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                    : "border-base-300 bg-base-100 text-base-content/80 hover:border-primary/40"
                }`}
              >
                <span className="font-black text-xs mb-0.5">UPI</span>
                <span className="text-[11px] leading-tight">QR / VPA</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("cod")}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  paymentMethod === "cod"
                    ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                    : "border-base-300 bg-base-100 text-base-content/80 hover:border-primary/40"
                }`}
              >
                <FaMoneyBillWave className="text-base mb-1" />
                <span className="text-[11px] leading-tight">Cash (COD)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default CartDrawer;
