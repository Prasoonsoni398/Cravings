import React from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../../components/userDashboard/Sidebar.jsx';

const UserDashboard = () => {
    const { isLogin,role } = useAuth();
  const navigate = useNavigate();
  const active = useLocation().state?.activeTab;
  const [activeTab, setActiveTab] = React.useState(active || "overview");

  if (!isLogin || role !== "customer") {
    return (
      <div className="h-[92vh] bg-[url('/foodTable.webp')]  bg-cover bg-center">
        <div className="h-full backdrop-blur-lg flex flex-col items-center justify-center ">
          <h1 className="text-2xl font-bold text-(--color-neutral-content)">
            Access Denied. Please log in as a customer to view this
            page.
          </h1>
          <button
            className="mt-4 px-4 py-2 bg-(--color-primary) text-white rounded-md"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }
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