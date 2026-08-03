import { createContext, useContext, useState, useMemo } from "react";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const addToCart = (item, restaurant) => {
    // If adding item from a different restaurant, we might want to clear cart or warn.
    // Assuming clear cart for simplicity or they only order from one at a time
    if (selectedRestaurant && selectedRestaurant._id !== restaurant._id) {
      // Clear cart if restaurant changes
      setCartItems([]);
    }
    
    setSelectedRestaurant(restaurant);

    setCartItems((prev) => {
      const exists = prev.find((i) => i._id === item._id);
      if (exists) {
        return prev.map((i) =>
          i._id === item._id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const decreaseQty = (itemId) => {
    setCartItems((prev) =>
      prev
        .map((i) => (i._id === itemId ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const removeItem = (itemId) => {
    setCartItems((prev) => prev.filter((i) => i._id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
    setSelectedRestaurant(null);
  };

  const totalItems = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.qty, 0);
  }, [cartItems]);

  const value = {
    cartItems,
    selectedRestaurant,
    addToCart,
    decreaseQty,
    removeItem,
    clearCart,
    totalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
