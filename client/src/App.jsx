import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Hero/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Feedback from "./pages/Feedback";
import HelpCenter from "./pages/HelpCenter";
import OrderNow from "./pages/OrderNow";
import Projects from "./pages/Projects";
import Skills from "./pages/Skills";
import PartnerWithUs from "./pages/PartnerWithUs";
import BecomeARider from "./pages/BecomeARider";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import SiteMap from "./pages/SiteMap";
import { Toaster } from "react-hot-toast";
import UserDashboard from "./pages/dashboard/UserDashboard";
import OverView from "./components/userDashboard/UserOverView";

import RestaurantDashboard from "./pages/dashboard/RestaurantDashboard";
import RiderDashboard from "./pages/dashboard/RiderDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";

const App = () => {
  return (
    <BrowserRouter>
      <Toaster />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/helpcenter" element={<HelpCenter />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/ordernow" element={<OrderNow />} />
        <Route path="/order-now" element={<OrderNow />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/partner-with-us" element={<PartnerWithUs />} />
        <Route path="/restaurant-dashboard/*" element={<RestaurantDashboard />} />
        <Route path="/become-a-rider" element={<BecomeARider />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/site-map" element={<SiteMap />} />
        <Route path="/rider-dashboard" element={<RiderDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* Dashboard routes  */}
        <Route path="/user/dashboard/*" element={<UserDashboard />} />
      </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
  );
};

export default App;
