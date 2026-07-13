import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { FiClock, FiHeart, FiShoppingCart, FiUser, FiArrowRight, FiMapPin, FiStar } from 'react-icons/fi'
import { restaurants } from '../../data/siteData.js'

const stats = [
  { label: 'Orders', value: '24', icon: <FiShoppingCart size={18} />, color: 'bg-orange-50 text-orange-600' },
  { label: 'Favorites', value: '08', icon: <FiHeart size={18} />, color: 'bg-rose-50 text-rose-600' },
  { label: 'Pending', value: '03', icon: <FiClock size={18} />, color: 'bg-amber-50 text-amber-600' },
  { label: 'Profile', value: '82%', icon: <FiUser size={18} />, color: 'bg-emerald-50 text-emerald-600' },
]

const OverView = () => {
  const { user } = useAuth()

  return (
    <div className='h-full overflow-auto bg-base-100 p-4 sm:p-6 lg:p-8'>
      <div className='rounded-lg bg-gradient-to-r from-primary to-warning p-6 text-primary-content shadow-lg'>
        <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
          <div>
            <p className='text-sm uppercase tracking-[0.3em] opacity-80'>Cravings dashboard</p>
            <h2 className='mt-2 text-2xl font-bold sm:text-3xl'>Welcome back, {user?.fullName || 'Foodie'}!</h2>
            <p className='mt-2 max-w-2xl text-sm sm:text-base opacity-90'>Track your orders, save your favorite restaurants, and discover fresh meals that match your cravings.</p>
          </div>
          <Link to='/order-now' className='inline-flex items-center justify-center gap-2 rounded-sm bg-base-100 px-4 py-2 text-sm font-semibold text-primary transition hover:opacity-90'>
            Order Again <FiArrowRight />
          </Link>
        </div>
      </div>

      <div className='mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
        {stats.map((item, index) => (
          <div key={index} className='rounded-lg border border-base-200 bg-base-100 p-4 shadow-sm flex justify-between'>
            
            <div>
              <p className='text-sm text-secondary'>{item.label}</p>
            <p className='text-2xl font-bold text-base-content'>{item.value}</p>
            </div>
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${item.color}`}>
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      <div className='mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]'>
        <div className='rounded-lg border border-base-200 bg-base-100 p-6 shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-xl font-semibold text-base-content'>Recommended for you</h3>
              <p className='text-sm text-secondary'>Popular spots picked for your taste.</p>
            </div>
            <Link to='/order-now' className='text-sm font-semibold text-primary'>Explore all</Link>
          </div>

          <div className='mt-4 space-y-3'>
            {restaurants.slice(0, 3).map((restaurant) => (
              <div key={restaurant.id} className='flex items-center justify-between rounded-2xl border border-base-200 bg-base-100 p-4'>
                <div>
                  <h4 className='font-semibold text-base-content'>{restaurant.name}</h4>
                  <div className='mt-1 flex flex-wrap items-center gap-2 text-sm text-secondary'>
                    <span className='inline-flex items-center gap-1'><FiStar className='text-amber-500' /> {restaurant.rating}</span>
                    <span className='inline-flex items-center gap-1'><FiMapPin /> {restaurant.city}</span>
                  </div>
                </div>
                <Link to='/order-now' className='rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-content'>View menu</Link>
              </div>
            ))}
          </div>
        </div>

        <div className='space-y-6'>
          <div className='rounded-lg border border-base-200 bg-base-100 p-6 shadow-sm'>
            <h3 className='text-lg font-semibold text-base-content'>Today’s activity</h3>
            <ul className='mt-4 space-y-3 text-sm text-secondary'>
              <li className='rounded-lg bg-base-100 p-3'>Your last order from <span className='font-semibold text-base-content'>Under The Mango Tree</span> was delivered 20 mins ago.</li>
              <li className='rounded-lg bg-base-100 p-3'>You saved <span className='font-semibold text-base-content'>3 restaurants</span> to your wishlist this week.</li>
              <li className='rounded-lg  bg-base-100 p-3'>New offer available for <span className='font-semibold text-base-content'>free delivery</span> on your next order.</li>
            </ul>
          </div>

          <div className='rounded-lg border border-base-200 bg-primary p-6 text-primary-content shadow-sm'>
            <h3 className='text-lg font-semibold'>Quick shortcuts</h3>
            <div className='mt-4 space-y-3'>
              <Link to='/order-now' className='flex items-center justify-between rounded-2xl bg-base-100/15 px-4 py-3'>
                <span>Order food</span><FiArrowRight />
              </Link>
              <Link to='/user/dashboard/wishlist' className='flex items-center justify-between rounded-2xl bg-base-100/15 px-4 py-3'>
                <span>View wishlist</span><FiHeart />
              </Link>
              <Link to='/user/dashboard/setting' className='flex items-center justify-between rounded-2xl bg-base-100/15 px-4 py-3'>
                <span>Update profile</span><FiUser />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OverView