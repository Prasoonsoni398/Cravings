import React, { useContext, useEffect, useState } from 'react'

export const AuthContext = React.createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("UserData")) || null);

    // what is useState 
    // useState is a React hook that allows you to add state to functional components. 
    // It returns an array with two elements: the current state value and a function to update that state. 
    // In this case, it initializes the user state with the value retrieved from sessionStorage (if available) or null if not.
    const [isLogin, setIsLogin] = useState(false);

    useEffect(() => {
        // if (user) {
        //     setIsLogin(true);
        // } else {
        //     setIsLogin(false);
        // }
        setIsLogin(!!user);
    }, [user]);

    const value = {
        user,
        setUser,
        isLogin,
        setIsLogin
    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


export const useAuth = () => useContext(AuthContext);


