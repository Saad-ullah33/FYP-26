import React from 'react'
import Navbar from './Navbar';

const Header = () => {
  return (
    // GLASSY WHITE CONTAINER
    // 1. bg-white/70: 70% opacity white (allows colors behind to blur through)
    // 2. backdrop-blur-md: The "frosted glass" effect
    // 3. sticky top-0: Keeps it pinned to the top
    <header className="sticky top-0 z-50 w-full h-20 bg-white/70 backdrop-blur-md shadow-sm border-b border-white/30 transition-all">
      
      {/* Alignment Container */}
      <div className="flex justify-between items-center h-full px-8 max-w-screen-2xl mx-auto">
        
        {/* LOGO (Dark Blue to match the theme) */}
        <div className="text-2xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-600 cursor-pointer">
          DreamProp
        </div>

        {/* NAVBAR */}
        {/* We pass the height down so links can center themselves */}
        <div className="h-full">
          <Navbar />
        </div>

      </div>
    </header>
  )
}

export default Header