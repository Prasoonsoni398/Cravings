import LogoHeader from "../assets/footerLogo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  const linkClass =
    "text-sm hover:text-primary transition-colors duration-200 cursor-pointer";
  const bottomLinkClass =
    "text-sm text-(--color-neutral-content) hover:text-primary transition-colors duration-200";

  return (
    <>
      <footer className="bg-(--color-neutral) flex justify-end w-full mx-auto text-(--color-neutral-content) py-8">
        <div className=" px-8 max-w-screen-xl w-full">
          <p className="text-sm text-center mb-8 text-(--color-neutral-content)">
            --- Your favorite food delivery platform connecting customers with
            restaurants and riders. ---
          </p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
            <div>
              <img src={LogoHeader} alt="Logo Header" className="h-35" />
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className={linkClass}>Home</Link>
                </li>
                <li>
                  <Link to="/about" className={linkClass}>About</Link>
                </li>
                <li>
                  <Link to="/order-now" className={linkClass}>Order Now</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">For Restaurants</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/register/restaurant" className={linkClass}>Partner With Us</Link>
                </li>
                <li>
                  <Link to="/restaurant-dashboard" className={linkClass}>Restaurant Dashboard</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">For Riders</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/register/rider" className={linkClass}>Become a Rider</Link>
                </li>
                <li>
                  <Link to="/rider-dashboard" className={linkClass}>Rider Dashboard</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Feedback &amp; Support</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/feedback" className={linkClass}>Submit Feedback</Link>
                </li>
                <li>
                  <Link to="/help-center" className={linkClass}>Help Center</Link>
                </li>
                <li>
                  <Link to="/contact" className={linkClass}>Contact Us</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-(--color-neutral-content)/20 my-8"></div>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-(--color-neutral-content) mb-4 md:mb-0">
              &copy; 2026 Cravings. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy-policy" className={bottomLinkClass}>
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className={bottomLinkClass}>
                Terms of Service
              </Link>
              <Link to="/site-map" className={bottomLinkClass}>
                Site Map
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
