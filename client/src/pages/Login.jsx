import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import loginBg from "../assets/images/foodTable.webp";

function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email :", userName);
    console.log("Password :", password);
  };

  return (
    <section className="relative h-[91vh] w-full">
      {/* Background */}
      <img
        src={loginBg}
        alt="Food Table"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Login Card */}
      <div className="absolute left-[8%] top-1/2 -translate-y-1/2">
        <div className="card w-[430px] bg-base-100 shadow-2xl">
          <div className="card-body">
            <h2 className="text-center text-3xl font-bold text-primary">
              Welcome Back
            </h2>

            <p className="mb-4 text-center text-secondary">
              Login to your Cravings account
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="label-text mb-2 block font-semibold">
                  Email
                </label>

                <input
                  type="email"
                  className="input w-full"
                  placeholder="Enter your Email"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>

              {/* Password */}
              <div>
                <label className="label-text mb-2 block font-semibold">
                  Password
                </label>

                <div className="input flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full outline-none"
                    placeholder="Enter your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              {/* Remember */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
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

              {/* Login */}
              <button className="btn btn-primary w-full">
                Login
              </button>
            </form>

            <div className="divider">
              Don't have an account?
            </div>

            <Link
              to="/register"
              className="link link-primary text-center font-semibold"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;