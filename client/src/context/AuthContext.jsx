import React, { useContext, useEffect, useState } from "react";

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [isLogin, setisLogin] = useState(false);

  useEffect(() => {
    // if(user){
    //     setisLogin(true)
    // }
    // else{
    //     setisLogin(false)
    // }

    setisLogin(!!user);
  }, [user]);

  const value = {
    user,
    setUser,
    isLogin,
    setisLogin,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
