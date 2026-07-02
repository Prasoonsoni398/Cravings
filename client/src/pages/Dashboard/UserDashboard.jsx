import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/userDashboard/Sidebar";
import Orders from "../../components/userDashboard/Order";
import WishList from "../../components/userDashboard/WishList";
import Settings from "../../components/userDashboard/Settings";
import Overview from "../../components/userDashboard/Overview";

const UserDashboard = () => {
  const { user } = useAuth();
  const [active , setActive]= useState("Overview")
  return (
    <>
     <div className="flex h-[91vh]">
        <div className="w-1/6 border border-primary h-full">
          <Sidebar active={active} setActive={setActive} />
        </div>
        <div className="w-5/6 border border-warning h-full">
          {active === "Overview" && <Overview />}
          {active === "Orders" && <Orders />}
          {active === "WishList" && <WishList />}
          {active === "Setting" && <Settings />}
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
