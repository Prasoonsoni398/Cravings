import React from "react";
import LoginPage from "../assets/images/loginPage.png";
import { FaUserCircle } from "react-icons/fa";

const Login = () => {
  return (
    <>
      <div className="max-w-6xl h-[90vh] flex justify-self-center items-center">
        <div className="grid grid-cols-2 gap-10">
          <div className="bg-(--background) flex justify-center rounded-2xl  items-center">
            <img src={LoginPage} alt="" />
          </div>
          <form className="flex flex-column gap-2 rounded-xl shadow-xl bg-(--card-background) ">
            <div>
              <FaUserCircle />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
