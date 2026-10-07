import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaPalette, FaShoppingCart } from "react-icons/fa";
import LogoHeader from "../assets/headerLogo.png";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { LogOut } from "lucide-react";
import { Dropdown, Button, Badge } from "./ui";

const themeOptions = [
  { value: "light", label: "Light", icon: "☀️" },
  { value: "dark", label: "Dark", icon: "🌙" },
  { value: "corporate", label: "Corporate", icon: "💼" },
  { value: "gourmet", label: "Gourmet", icon: "🍽️" },
  { value: "pastel", label: "Pastel", icon: "🎨" },
  { value: "shadcn", label: "Shadcn", icon: "⚡" },
  { value: "slack", label: "Slack", icon: "💬" },
  { value: "mintlify", label: "Mintlify", icon: "🌿" },
];

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setIsLogin, isLogin, setUser, role } = useAuth();
  const { totalItems } = useCart();

  const dashboardRoute =
    role === "restaurant"
      ? "/restaurant-dashboard"
      : role === "rider"
        ? "/rider-dashboard"
        : role === "admin"
          ? "/admin-dashboard"
          : "/user/dashboard";

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("cravings-theme") || "light";
    return themeOptions.some((option) => option.value === savedTheme)
      ? savedTheme
      : "light";
  });

  const currentTheme = themeOptions.find((t) => t.value === theme) || themeOptions[0];

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    setIsLogin(false);
    sessionStorage.removeItem("UserData");
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("cravings-theme", theme);
  }, [theme]);

  return (
    <nav className="flex sticky top-0 z-50 justify-between px-6 md:px-12 h-16 items-center bg-primary gap-4 shadow-md transition-colors">
      <Link to={"./"} className="transition-transform hover:scale-105">
        <img src={LogoHeader} alt="header-images" className="h-14" />
      </Link>
      <div className="flex items-center gap-3">
        {/* Cart Button */}
        <Link
          to="/cart"
          className="relative p-2.5 text-white hover:text-white/80 transition-colors rounded-xl hover:bg-white/10"
        >
          <FaShoppingCart className="text-xl" />
          {totalItems > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-rose-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-[10px] font-black shadow-md animate-bounce">
              {totalItems}
            </span>
          )}
        </Link>

        {/* Beautiful Floating Theme Dropdown */}
        <Dropdown
          label={currentTheme.label}
          icon={<FaPalette className="text-white text-xs" />}
          align="right"
          size="sm"
          triggerClassName="bg-white/15 hover:bg-white/25 text-white border border-white/25 backdrop-blur-md rounded-xl font-bold shadow-xs px-3 py-1.5"
          menuClassName="w-44 shadow-2xl border border-base-200"
          items={themeOptions.map((opt) => ({
            label: opt.label,
            icon: opt.icon,
            active: theme === opt.value,
            onClick: () => setTheme(opt.value),
          }))}
        />

        {isLogin ? (
          <div className="flex items-center gap-3">
            <span className="text-white font-bold text-sm hidden lg:inline">
              {user.fullName}
            </span>
            <Link to={dashboardRoute}>
              <Button
                size="sm"
                variant="soft"
                className="bg-white text-primary hover:bg-white/90 font-bold shadow-sm"
              >
                Dashboard
              </Button>
            </Link>
            <img
              src={
                user.photo?.url ||
                user?.photo ||
                "https://placehold.co/600x400?text=U"
              }
              alt={user.fullName}
              className="w-10 h-10 rounded-xl object-cover border-2 border-white/30 shadow-xs hidden sm:block"
            />
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20 p-2"
              onClick={handleLogout}
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 font-bold"
              >
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button
                variant="soft"
                size="sm"
                className="bg-white text-primary hover:bg-white/90 font-bold shadow-sm"
              >
                Register
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
