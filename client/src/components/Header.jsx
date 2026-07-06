import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPalette } from "react-icons/fa";
import LogoHeader from "../assets/headerLogo.png";
import { useAuth } from "../context/AuthContext.jsx";
import { LogOut } from "lucide-react";
import Logo from "../assets/logo.jpeg";

const themeOptions = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "corporate", label: "Corporate" },
  { value: "gourmet", label: "Gourmet" },
  { value: "pastel", label: "Pastel" },
  { value: "shadcn", label: "Shadcn" },
  { value: "slack", label: "Slack" },
  { value: "mintlify", label: "Mintlify" },
];

const Header = () => {
  const navigate = useNavigate();
  const { user, setIsLogin, isLogin, setUser } = useAuth();

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("cravings-theme") || "light";
    return themeOptions.some((option) => option.value === savedTheme)
      ? savedTheme
      : "light";
  });

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
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
    <>
      <nav className="flex sticky top-0 z-99 justify-between px-6 md:px-12 h-16 items-center bg-primary gap-4">
        <Link to={"./"}>
          <img src={LogoHeader} alt="header-images" className="h-14 " />
        </Link>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 rounded-md border border-white/20 bg-base-100/10 px-3 py-1 text-sm text-white">
            <FaPalette className="shrink-0" />
            <span className="hidden sm:inline">Theme</span>
            <select
              value={theme}
              onChange={(event) => setTheme(event.target.value)}
              className="bg-transparent outline-none "
              aria-label="Theme selection"
            >
              {themeOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="text-primary"
                >
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          {isLogin ? (
            <>
              <div className="flex items-center gap-4 ">
                <span className=" text-white">{user.fullName}</span>
                <Link
                  to="/user/dashboard"
                  className="p-2 bg-base-100 rounded-md text-primary text-decoration-none flex items-center hover:outline "
                >
                  Dashboard
                </Link>
                <img
                  src={user.photo?.url || user?.photo || "https://placehold.co/600x400?text=U"}
                  alt={user.fullName}
                  className="w-12 h-12 rounded-full object-cover "
                />
                <div>
                  <button
                    onClick={handleLogout}
                    className="p-2 bg-base-100 rounded-md text-primary text-decoration-none"
                  >
                    <LogOut />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link
                to="./login"
                className="px-3 py-1 hover:outline  rounded-md text-white text-decoration-none"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1 bg-base-100 rounded-md text-primary text-decoration-none flex items-center hover:bg-transparent hover:text-white hover:outline "
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;
