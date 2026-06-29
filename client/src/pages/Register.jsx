import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import registerbg from "../assets/images/foodTable.webp";
import api from "../config/api.config.js";

function Register() {
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const [agree, setAgree] = useState(false);
  const [validateError, setValidateError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agree) {
      setValidateError("Please accept Terms & Conditions.");
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setValidateError("Passwords do not match.");
      return;
    }

    setValidateError("");

    const payload = {
      fullName: registerData.fullName,
      email: registerData.email.toLowerCase(),
      phone: registerData.phone,
      gender: registerData.gender,
      password: registerData.password,
      dob:registerData.dob,
    };

    try {
      const res = await api.post("/auth/register", payload);

      alert(res.data.message);

      setRegisterData({
        fullName: "",
        email: "",
        phone: "",
        gender: "",
        password: "",
        confirmPassword: "",
        dob:"",
      });

      setAgree(false);

      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <section className="relative h-[91vh] w-full overflow-hidden">
      {/* Background */}
      <img
        src={registerbg}
        alt="Food Table"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Register Card */}
      <div className="absolute right-[8%] top-1/2 -translate-y-1/2">
        <div className="card w-[480px] bg-base-100 shadow-2xl">
          <div className="card-body p-8">
            <h2 className="text-center text-4xl font-bold text-primary">
              Create Account
            </h2>

            <p className="text-center text-secondary">
              Join us and start your food journey.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Full Name */}
              <input
                type="text"
                name="fullName"
                className="input input-bordered w-full"
                placeholder="Enter your full name"
                value={registerData.fullName}
                onChange={handleChange}
                required
              />

              {/* Email */}
              <input
                type="email"
                name="email"
                className="input input-bordered w-full"
                placeholder="Enter your email"
                value={registerData.email}
                onChange={handleChange}
                required
              />

              {/* Phone */}
              <input
                type="tel"
                name="phone"
                className="input input-bordered w-full"
                placeholder="Enter your phone number"
                value={registerData.phone}
                onChange={handleChange}
                required
              />

              {/* Gender */}
              <div className="grid grid-cols-2 gap-2">
                <select
                  name="gender"
                  className="select select-bordered w-full"
                  value={registerData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>

                <input
                  type="date"
                  name="dob"
                  className="input input-bordered w-full"
                  placeholder="Enter your DOB"
                  value={registerData.dob}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password */}
              <div className="input input-bordered flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  className="grow"
                  value={registerData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="input input-bordered flex items-center">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  className="grow"
                  value={registerData.confirmPassword}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Terms */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />

                <span className="text-sm">
                  I agree to the{" "}
                  <span className="font-semibold text-primary">
                    Terms & Conditions
                  </span>
                </span>
              </label>

              {/* Validation Error */}
              {validateError && (
                <p className="text-center text-sm text-error">
                  {validateError}
                </p>
              )}

              {/* Register Button */}
              <button type="submit" className="btn btn-primary w-full">
                Register
              </button>

              <div className="divider"></div>

              {/* Login */}
              <p className="text-center text-secondary">
                Already registered?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-primary hover:underline"
                >
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;
