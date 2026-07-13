import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Sidebar from '../../components/userDashboard/UserSidebar.jsx';
import Overview from '../../components/userDashboard/UserOverView.jsx';
import Orders from '../../components/userDashboard/UserOrder.jsx';
import Setting from '../../components/userDashboard/UserSetting.jsx';

const UserDashboard = () => {
  const { isLogin, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = React.useState(() => {
    const pathTab = location.pathname.split('/').filter(Boolean).pop();
    return ['overview', 'order', 'wishlist', 'setting'].includes(pathTab) ? pathTab : 'overview';
  });

  React.useEffect(() => {
    const pathTab = location.pathname.split('/').filter(Boolean).pop();
    if (['overview', 'order', 'wishlist', 'setting'].includes(pathTab)) {
      setActiveTab(pathTab);
    }
  }, [location.pathname]);

  // if (!isLogin || role !== "customer") {
  //   return (
  //     <div className="h-[92vh] bg-[url('/foodTable.webp')]  bg-cover bg-center">
  //       <div className="h-full backdrop-blur-lg flex flex-col items-center justify-center ">
  //         <h1 className="text-2xl font-bold text-(--color-neutral-content)">
  //           Access Denied. Please log in as a customer to view this
  //           page.
  //         </h1>
  //         <button
  //           className="mt-4 px-4 py-2 bg-(--color-primary) text-white rounded-md"
  //           onClick={() => navigate("/login")}
  //         >
  //           Go to Login
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }
    return (
        <>
            {/* create a sidebar and main content area */}
           <div className="h-[91vh] flex gap-2 ">
        <div className="w-55 bg-(--color-base-200)  rounded-lg shadow-md h-full">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="w-14/17 bg-(--color-base-100) p-4 rounded-lg shadow-md h-full">
          {activeTab === "overview" && <Overview />}
          {activeTab === "order" && <Orders />}
          {activeTab === "setting" && <Setting />}
        </div>
      </div>
        </>
    )
}

export default UserDashboard