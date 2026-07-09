import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { FaBorderAll } from "react-icons/fa6";
import { MdOutlineDashboard, MdOutlineFavorite, MdSettingsSuggest } from "react-icons/md";

const MenuItems = [
    { name: "Overview", path: "overview", icon: <MdOutlineDashboard /> },
    { name: "Order", path: "order", icon: <FaBorderAll /> },
    { name: "Wishlist", path: "wishlist", icon: <MdOutlineFavorite /> },
    { name: "Setting", path: "setting", icon: <MdSettingsSuggest /> },
]

const RiderSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname.split('/').pop();

    const handleNavigation = (path) => {
        navigate(`/user/dashboard/${path}`);
    }

    return (
        <>
            <div className='w-full max-w-[250px] fixed border border-base-200 bg-base-200 shadow-md h-[91vh]'>
                <div className='border-b-2 text-center  text-primary font-bold border-primary text-2xl p-3'>
                    User Dashboard
                </div>
                <div className='p-2 flex flex-col gap-3 items-center '>
                    {MenuItems.map((item, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleNavigation(item.path)}
                            className={`flex items-center hover:border-primary w-full gap-2 text-xl p-2 rounded-sm border ${currentPath === item.path && "bg-primary text-primary-content"}`}>
                            {item.icon}
                            <span>{item.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </>
    )
}

export default RiderSidebar