import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-base-300 px-6 py-16 text-base-content">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
        <div>
          <h3 className="text-2xl font-bold text-primary">Cravings</h3>
          <p className="mt-4 max-w-md text-sm leading-7 text-primary-content">
            Your favorite food delivery platform connecting customers with restaurants and riders.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-primary-content">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm text-primary-content ">
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact Us</Link></li>
            <li><Link to="/register" className="hover:text-primary">Register</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold">For Restaurants</h4>
          <ul className="mt-4 space-y-2 text-sm text-primary-content">
            <li><Link to="/register" className="hover:text-primary">Partner With Us</Link></li>
            <li><Link to="/login" className="hover:text-primary">Restaurant Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold">Support</h4>
          <ul className="mt-4 space-y-2 text-sm text-primary-content">
            <li><Link to="/contact" className="hover:text-primary">Help Center</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Submit Feedback</Link></li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-3 border-t border-base-300 pt-6 text-sm text-base-content/60 md:flex-row md:items-center md:justify-between">
        <p>© 2026 Cravings. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="/" className="hover:text-primary">Privacy Policy</a>
          <a href="/" className="hover:text-primary">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;