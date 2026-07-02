import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const UserDashboard = () => {
  const { user } = useAuth();
  return (
    <>
      <div className="flex gap-3">
        <div>Sidebar</div>
        <div>Content</div>
      </div>
    </>
  );
};

export default UserDashboard;
