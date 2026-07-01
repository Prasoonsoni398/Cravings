import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

const UserDashboard = () => {

    const {user}=useAuth()
  return (
    <>
    <div className='p-5 m-5 bg-base-100 w-100'>
        <div className='flex gap-3 items-center'>
            <div className='w-16 h-16 rounded-full'>
                <img src={user.photo} alt=""className='w-full h-full overflow-hidden' />
            </div>
            <h1 className='text-xl font-semibold'>Welcome Back, <span className='text-warning'>{user.fullName}</span></h1>
        </div>
        <p >{user.email}</p>
    </div>
    </>
  )
}

export default UserDashboard