import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../config/api.config.js";
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRegisterData((prev) => ({ ...prev, [name]: value,}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();   

    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match");
      return;
    } 

    setError("");

    const payload = {
      fullName: registerData.fullName.trim(),
      email: registerData.email.toLowerCase().trim(),
      phone: registerData.phone.trim(),
      gender: registerData.gender,
      dob: registerData.dob,
      password: registerData.password,
    };

    try {
      const res = await api.post("/auth/register", payload);

      // alert(res.data.message);
      toast.success('Register Successfully  !');

      setRegisterData({
        fullName: "",
        email: "",
        phone: "",
        gender: "",
        dob: "",
        password: "",
        confirmPassword: "",
      });

      navigate("/login");
    } catch (err) {
      toast.error("Register Failed!");
      setError(err.response?.data?.message || "Registration Failed");
    }
  };

  const inputClass =
    "border border-primary p-2 rounded outline-none focus:ring-2 focus:ring-primary";

  return (
    <main className="min-h-[90vh] flex items-center justify-end bg-[url('/commonBG.avif')] bg-cover bg-center p-6">
      <div className="w-full max-w-lg bg-base-100 rounded-lg shadow-lg p-6 me-3">

        <h1 className="text-3xl font-bold text-center text-primary">
          Create Account
        </h1>

        <p className="text-center mb-6 text-secondary">
          Register to continue
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

          {/* Full Name */}
          <div className="col-span-2 flex flex-col gap-1">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={registerData.fullName}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={registerData.email}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={registerData.phone}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          {/* Gender */}
          <div className="flex flex-col gap-1">
            <label>Gender</label>
            <select
              name="gender"
              value={registerData.gender}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* DOB */}
          <div className="flex flex-col gap-1">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={registerData.dob}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={registerData.password}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={registerData.confirmPassword}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          {error && (
            <p className="col-span-2 text-error text-sm">
              {error}
            </p>
          )}

          {/* Terms */}
          <div className="col-span-2 flex items-center gap-2">
            <input type="checkbox" required />
            <span className="text-sm">
              I agree to the{" "}
              <Link
                to="/terms-of-service"
                className="text-primary"
              >
                Terms & Conditions
              </Link>
            </span>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="col-span-2 bg-primary text-white py-2 rounded hover:opacity-90"
          >
            Register
          </button>
        </form>

        <div className="text-center mt-5">
          <p>
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-primary font-semibold"
            >
              Login
            </button>
          </p>
        </div>

      </div>
    </main>
  );
};

export default Register;