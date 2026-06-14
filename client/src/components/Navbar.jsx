import { Link } from "react-router-dom";
import circleLogo from "../assets/images/HeaderLogo.png";

const Header = () => {
  return (
    <header className="py-2 bg-(--primary)">
      <div className="px-4 mx-auto flex justify-between items-center">
        {/* Logo */}
        <div>
          <Link to="/">
            <img
              src={circleLogo}
              alt="Logo"
              className="h-14 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-6 py-2 rounded-md border border-(--accent) text-(--accent) font-medium hover:bg-(--accent) hover:text-white hover:border-transparent transition-all duration-300"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-6 py-2 rounded-md border border-transparent bg-(--accent) text-(--white) font-medium transition-all duration-300 hover:bg-transparent hover:border-(--accent) hover:text-(--accent)"
          >
            Register
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
