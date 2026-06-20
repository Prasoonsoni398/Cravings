import React, { useState, useEffect } from "react";
import { FaUserCircle, FaLock, FaEnvelope, FaPhone } from "react-icons/fa";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const newErrors = {};

    // Username Validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    // Email Validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email";
    }

    // Phone Validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    // Password Validation
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm Password Validation
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid) return;

    console.log("Register Data:", formData);

    // API Call Here
  };

  return (
    <div className="max-w-6xl mx-auto h-[90vh] flex items-center">
      <div className="grid md:grid-cols-2 gap-10 w-full">
        {/* Left Side */}
        <div className="bg-(--background) flex justify-center shadow-xl items-center rounded-2xl p-6 hidden md:flex">
          <div className="text-center">
            <FaUserCircle className="text-8xl text-(--primary) mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Join Us Today</h3>
            <p className="text-gray-600">Create your account and start exploring amazing food experiences</p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex justify-center items-center">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md shadow-xl rounded-2xl p-8 bg-white"
          >
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <FaUserCircle className="text-7xl text-(--primary)" />
            </div>

            <h2 className="text-3xl font-bold text-center mb-2">
              Create Account
            </h2>
            <p className="text-center text-gray-500 mb-6 text-sm">
              Fill in the details below to register
            </p>

            {/* Username */}
            <div className="mb-4">
              <label className="block mb-2 font-medium">
                Username
              </label>

              <div className="relative">
                <FaUserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-3 outline-none focus:border-(--primary)"
                />
              </div>

              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block mb-2 font-medium">
                Email Address
              </label>

              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-3 outline-none focus:border-(--primary)"
                />
              </div>

              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label className="block mb-2 font-medium">
                Phone Number
              </label>

              <div className="relative">
                <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-3 outline-none focus:border-(--primary)"
                />
              </div>

              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block mb-2 font-medium">
                Password
              </label>

              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-3 outline-none focus:border-(--primary)"
                />
              </div>

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label className="block mb-2 font-medium">
                Confirm Password
              </label>

              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-3 outline-none focus:border-(--primary)"
                />
              </div>

              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 ${
                isFormValid
                  ? "bg-(--primary) hover:opacity-90"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Register
            </button>

            <p className="text-center mt-6 text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-(--primary) font-semibold hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;