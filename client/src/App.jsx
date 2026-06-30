import React from "react";
import Header from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ContactUs from "./pages/Contact";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {Toaster} from "react-hot-toast"
import UserDashboard from "./pages/Dashboard/UserDashboard";

function App() {
  return ( 
    <>
      <BrowserRouter>
      <Toaster />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />        
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard Routes */}
          <Route path="/user/dashboard" element={<UserDashboard/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
