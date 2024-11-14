import React from 'react'
import { NotificationUser } from './components/NotificationUser'

const Navbar = () => {
  return (
    <div className='w-full h-[80px] bg-slate-900 flex items-center justify-between px-10'>
      <p>Navbar</p>

        <NotificationUser />
    </div>
  )
}

export default Navbar
