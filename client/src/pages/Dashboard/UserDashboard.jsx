import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

const UserDashboard = () => {

    const [userData,setUserData] = useState("")
     useEffect(() => {
    setUserData(JSON.parse(sessionStorage.getItem("UserData")));
  }, []);
  return (
    <>
    <div className='p-5 m-5 bg-base-100 w-100'>
        <div className='flex gap-3 items-center'>
            <div className='w-16 h-16 rounded-full'>
                <img src={userData.photo} alt=""className='w-full h-full overflow-hidden' />
            </div>
            <h1 className='text-xl font-semibold'>Welcome Back, <span className='text-warning'>{userData.fullName}</span></h1>
        </div>
        <p >{userData.email}</p>
    </div>
    </>
  )
}

export default UserDashboard