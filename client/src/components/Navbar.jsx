import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import HeaderLogo from "../assets/images/HeaderLogo.png";

function Header() {
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
            to="/login"
            className="rounded-sm px-2 py-1 text-primary-content border border-transparent hover:border hover:border-primary-content"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-sm border border-transparent bg-primary-content px-2 py-1 text-primary transition hover:bg-primary hover:text-primary-content hover:border hover:border-primary-content"
          >
            Register
          </Link>

            <Link
            to="/contact"
            className="rounded-sm px-2 py-1 text-primary-content bg-warning/80 hover:bg-warning"
          >
            Contact Us
          </Link>

        </div>
      </div>
    </header>
  );
}

export default Header;