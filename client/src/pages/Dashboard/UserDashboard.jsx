import React from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../../components/userDashboard/Sidebar.jsx';

const UserDashboard = () => {
    return (
        <>
            {/* create a sidebar and main content area */}
            <div className='flex h-full'>
                <div className='w-1/6 border border-base-300'>
                    <Sidebar />
                </div>
                <div className='w-5/6 h-full border border-base-300 p-4'>
                    <Outlet />
                </div>
            </div>
        </>
    )
}

export default UserDashboard