import React from "react";
import {
  MdOutlineDashboard,
  MdOutlineBorderColor,
  MdFavoriteBorder,
} from "react-icons/md";
import { PiListHeart } from "react-icons/pi";
import { BsPersonGear } from "react-icons/bs";
import { useAuth } from "../../context/AuthContext";

const MenuItems = [
  { name: "Overview", icon: <MdOutlineDashboard /> },
  { name: "Orders", icon: <MdOutlineBorderColor /> },
  { name: "WishList", icon: <PiListHeart /> },
  { name: "Setting", icon: <BsPersonGear /> },
];

const Sidebar = ({ active, setActive }) => {
  const { user } = useAuth();
  return (
    <>
      <div className=" p-2">
        <div className="flex gap-3 items-center border-b-2 border-primary p-2 pb-4 ">
          <div className="w-10 h-10 rounded-full overflow-hidden cursor-pointer">
            <img
              src={user.photo}
              alt=""
              className="w-full h-full object-cover "
            />
          </div>
          <h1 className="text-xl font-semibold flex flex-col cursor-pointer">
            <span className="text-warning">{user.fullName}</span>
          </h1>
        </div>

        <div className="space-y-2 mt-4 p-3">
          {MenuItems.map((item, idx) => (
            <button
              key={idx}
              className={`flex gap-3 px-4 font-semibold items-center  rounded-lg w-full p-2 ${active === item.name ? "bg-primary text-primary-content" : "hover:bg-primary/10"}`}
              onClick={() => setActive(item.name)}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
