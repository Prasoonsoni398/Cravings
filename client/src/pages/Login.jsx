import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../config/api.config.js";
import toast from 'react-hot-toast';
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const { setUser, setIsLogin } = useAuth();
  const navigate = useNavigate("");
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [validateError, setValidateError] = useState();

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      email: loginData.email.toLowerCase(),
      password: loginData.password,
    };

    try {
      const res = await api.post("/auth/login", payload);

      toast.success(res.data.message);
      sessionStorage.setItem("UserData", JSON.stringify(res.data.data));
      setUser(res.data.data);
      setIsLogin(true);
      navigate("/user/dashboard");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className='h-[90vh] bg-[url("/foodTable.webp")] bg-yellow-400 grid items-center justify-start bg-cover bg-center md:ps-30 '>
        <div className="bg-base-100 p-10 grid gap-8 rounded-md w-100">
          <div className="grid gap-3">
            <h1 className="text-4xl text-center font-semibold text-primary ">
              Welcome Back
            </h1>
            <p className="text-center">Login to your Cravings account</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid mb-4">
              <label htmlFor="email" className="mb-2 text-1xl">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                value={loginData.email}
                onChange={handleChange}
                className="border text-primary focus:outline focus:outline-primary p-1 rounded focus:outline-2"
              />
            </div>
            <div className="grid mb-4">
              <label htmlFor="password" className="mb-2 text-1xl">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                value={loginData.password}
                onChange={handleChange}
                className="border border-primary focus:outline focus:outline-primary p-1 rounded focus:outline-2"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 mb-4 rounded-md bg-primary text-white text-lg"
            >
              Login
            </button>
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-17 border" />
              <p className="">Don't have an account?</p>
              <div className="w-17 border" />
            </div>
            <p className="text-center ">
              <Link
                to='/register'
                className="text-primary cursor-pointer"
              >
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
