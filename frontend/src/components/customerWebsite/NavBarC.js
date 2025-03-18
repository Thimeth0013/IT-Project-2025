import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { MenuIcon, XIcon, UserIcon, Bold } from 'lucide-react'
import logo from "../../assets/Blue White Illustrative Car Wash Logo.png";

const NavBarC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  return (
    <nav className="sticky top-0 w-full bg-[#1a1a1a] text-white z-10 py-0">
    <div className="container mx-auto flex items-center px-6">
        <Link to="/" className="text-2xl font-bold">
          <img src={logo} style={{height: "40px"}}/>
        </Link>
        
        {/* Desktop menu - centered */}
        <div className="hidden md:flex items-center justify-center flex-1">
          <div className="flex items-center space-x-12" style={{marginRight: "50px", fontWeight: "500"}}>
            <Link to="/" className="hover:text-[#D84040] transition-colors">
              Home
            </Link>
            <Link
              to="/services"
              className="hover:text-[#D84040] transition-colors"
            >
              Services
            </Link>
            <Link to="/about" className="hover:text-[#D84040] transition-colors">
              About
            </Link>
            <Link
              to="/about#contact"
              className="hover:text-[#D84040] transition-colors"
            >
            Contact
            </Link>
          </div>
        </div>
        
        {/* User profile icon - moved to the right */}
        <div className="hidden md:block">
          <Link
            to="/profile"
            className="hover:text-[#E63946] transition-colors p-2 rounded-full hover:bg-white/10"
          >
            <UserIcon size={24} />
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>
      
      {/* Mobile menu - centered */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#1d1616] w-full">
          <div className="flex flex-col items-center space-y-4 px-4 py-6">
            <Link
              to="/"
              className="hover:text-[#E63946] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>

            <Link
              to="/services"
              className="hover:text-[#E63946] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>

            <Link
              to="/about"
              className="hover:text-[#E63946] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>

            <Link
              to="/about#contact"
              className="hover:text-[#E63946] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>

            <Link
              to="/profile"
              className="flex items-center hover:text-[#E63946] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <UserIcon size={24} className="mr-2" />
              <span>Profile</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default NavBarC;