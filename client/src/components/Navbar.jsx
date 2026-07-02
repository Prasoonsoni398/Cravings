import { useEffect, useState, } from "react";
import { Link } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import HeaderLogo from "../assets/images/HeaderLogo.png";
import { AiOutlineLogout } from "react-icons/ai";
import { useAuth } from "../context/AuthContext";


function Header() {
    const { user, setUser, isLogin, setIsLogin } = useAuth();

     const handleLogout = () => {
    sessionStorage.removeItem("UserData");
    setIsLogin(false);
    setUser(false);
    navigate("/");
     }
  
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    const html = document.documentElement;

    if (theme === "dark") {
      html.classList.add("dark");
      html.setAttribute("data-theme", "dark");
    } else {
      html.classList.remove("dark");
      html.setAttribute("data-theme", "light");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  

  return (
    <header className="h-16 bg-primary">
      <div className="flex h-full items-center justify-between px-6">

        {/* Logo */}
      <div className="flex gap-3 items-center">
          <Link to="/">
          <img
            src={HeaderLogo}
            alt="Logo"
            className="h-14"
          />
        </Link>

         <button
            onClick={toggleTheme}
            className="btn btn-circle btn-ghost text-primary-content"
          >
            {theme === "dark" ? (
              <FaSun size={18} />
            ) : (
              <FaMoon size={18} />
            )}
          </button>
      </div>

        <div className="flex items-center gap-3">

          {/* Theme Button */}
         

          

            <Link
            to="/contact"
            className="rounded-sm px-2 py-1 text-primary-content bg-warning/80 hover:bg-warning"
          >
            Contact Us
          </Link>

          {isLogin ? (
            <div className="border-s-2 flex justify-center items-center gap-4 px-4">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img
                  src={user.photo}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <Link
                to={"/user/dashboard"}
                className="hover:underline hover:text-(--accent)"
              >
                {user.fullName}
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-300 hover:text-red-600"
              >
                <AiOutlineLogout />
              </button>
            </div>
          ) : (
            <>
              <Link
                to={"/login"}
                className="hover:underline hover:text-(--accent)"
              >
                Login
              </Link>
              <Link to={"/register"} className="hover:underline">
                Register
              </Link>
            </>
          )}

        </div>
      </div>
    </header>
  );
}

export default Header;