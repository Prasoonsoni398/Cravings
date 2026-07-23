import React, { useEffect, useState } from "react";
import api from "../../config/ApiConfig";
import toast from "react-hot-toast";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/my");
        setOrders(res.data.data || []);
      } catch (error) {
        toast.error("Unable to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-lg text-secondary">
        Loading your orders...
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="text-center text-lg text-secondary">
        No orders found. Place a new order from the Order Now page.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-base-content">My Orders</h2>
        {orders.map((order) => (
          <div
            key={order._id}
            className="rounded-md border border-base-200  bg-primary-content p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-natural">
                  {order.restaurantName}
                </h3>
                <p className="text-sm text-secondary">
                  Ordered on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className="rounded-sm bg-primary px-4 py-2 text-sm border font-semibold text-primary-content">
                {order.status}
              </span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-primary-contemnt">
                  Delivery Address
                </p>
                <p className="text-sm text-secondary">
                  {order.deliveryAddress}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-(--color-neutral)">
                  Total Price
                </p>
                <p className="text-sm text-secondary">₹{order.totalPrice}</p>
              </div>
            </div>
            <div className="mt-5 rounded-3xl bg-primary-content p-4">
              <h4 className="mb-3 text-sm font-semibold text-(--color-neutral)">
                Items
              </h4>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between rounded-2xl bg-base-100 px-4 py-3 text-sm shadow-sm"
                  >
                    <span>{item.name}</span>
                    <span>
                      {item.qty} × ₹{item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Order;
