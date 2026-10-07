import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

/**
 * Route handler for /cart.
 * Instead of displaying a standalone cart page, opens the animated right-side
 * cart drawer and redirects to the ordering menu view.
 */
const Cart = () => {
  const { openCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    openCart();
    navigate("/order-now", { replace: true });
  }, [openCart, navigate]);

  return null;
};

export default Cart;
