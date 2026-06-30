import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import loginBg from "../assets/images/foodTable.webp";
import api from "../config/api.config.js";
import toast from "react-hot-toast";

function Login() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [validateError, setValidateError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      setValidateError("Please fill all fields.");
      return;
    }

    setValidateError("");

    const payload = {
      email: loginData.email.toLowerCase(),
      password: loginData.password,
    };

    try {
      const res = await api.post("/auth/login", payload);

      toast.success(res.data.message);

      // Clear form
      setLoginData({
        email: "",
        password: "",
      });
      sessionStorage.setItem("UserData",JSON.stringify(res.data.data))
      navigate("/user/dashboard");
    } catch (error) {
      setValidateError(
        toast.error(error.response?.data?.message || "Login Failed"),
      );
    }
  };

  return (
    <section className="relative h-[91vh] w-full overflow-hidden">
      {/* Background */}
      <img
        src={loginBg}
        alt="Food Table"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Login Card */}
      <div className="absolute left-[8%] top-1/2 -translate-y-1/2">
        <div className="card w-[430px] bg-base-100 shadow-2xl">
          <div className="card-body p-8">
            <h2 className="text-center text-3xl font-bold text-primary">
              Welcome Back
            </h2>

            <p className="mb-4 text-center text-secondary">
              Login to your Cravings account
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="label mb-2">
                  <span className="label-text font-semibold">Email</span>
                </label>

                <input
                  type="email"
                  name="email"
                  className="input input-bordered w-full"
                  placeholder="Enter your Email"
                  value={loginData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="label mb-2">
                  <span className="label-text font-semibold">Password</span>
                </label>

                <div className="input input-bordered flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="grow"
                    placeholder="Enter your Password"
                    value={loginData.password}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary checkbox-sm"
                  />
                  <span className="label-text">Remember me</span>
                </label>

                <Link
                  to="/forgot-password"
                  className="link link-primary text-sm"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <button type="submit" className="btn btn-primary w-full">
                Login
              </button>
            </form>

            <div className="divider">Don't have an account?</div>

            {/* Register */}
            <p className="text-center">
              <Link
                to="/register"
                className="font-semibold text-primary hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
