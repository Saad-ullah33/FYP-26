import React from 'react'
import Navbar from './Navbar';
const Header = () => {
  return (
    <div className='bg-blue-600 flex justify-between items-center px-10 h-10 text-white font-semibold'>
      <div className="logo flex items-center ">Logo</div>
      {Navbar()}
    </div>
  )
}

export default Header
