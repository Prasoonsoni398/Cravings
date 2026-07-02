import React from 'react'
import { useAuth } from '../../context/AuthContext'


const Settings = () => {

    const {user}= useAuth()
  return (
    <>
     <div className="p-5 m-5 bg-base-00 border border-base-300/30 hover:bg-primary/10 hover:border-primary hover:-translate-y-1.5 shadow-md rounded-2xl w-100 transform transition-all duration-300"> 
        <div className="flex gap-3 items-center">
          <div className="w-16 h-16 rounded-full overflow-hidden">
            <img
              src={user.photo}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-xl font-semibold flex flex-col">
            Welcome Back, <span className="text-warning">{user.fullName}</span>
          </h1>
        </div>
        <p className="ml-19 ">{user.email}</p>
      </div>
    </>
  )
}

export default Settings