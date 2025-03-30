import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MenuIcon, XIcon, LogIn, UserCheck, CircleUserRound, LogOut, ChevronDown } from 'lucide-react';
import logo from '../../assets/Blue White Illustrative Car Wash Logo.png';

const NavBarC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false); // Track dropdown visibility
  const navigate = useNavigate();
  const dropdownRef = useRef(null); // Ref for the dropdown menu

  // Check if the user is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true); // User is logged in
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    localStorage.removeItem('user'); // Remove user data from localStorage
    setIsLoggedIn(false); // Update login status
    navigate('/'); // Redirect to home page
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false); // Close dropdown
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="sticky top-0 w-full bg-[#1a1a1a] text-white z-10 py-0">
      <div className="container mx-auto flex items-center px-6">
        <Link to="/" className="text-2xl font-bold">
          <img src={logo} style={{ height: '40px' }} alt="Logo" />
        </Link>

        {/* Desktop menu - centered */}
        <div className="hidden md:flex items-center justify-center flex-1">
          <div className="flex items-center space-x-12" style={{ fontWeight: '500' }}>
            <Link to="/" className="hover:text-[#D84040] transition-colors">
              Home
            </Link>
            <Link to="/services" className="hover:text-[#D84040] transition-colors">
              Services
            </Link>
            <Link to="/about" className="hover:text-[#D84040] transition-colors">
              About
            </Link>
            <Link to="/contact" className="hover:text-[#D84040] transition-colors">
              Contact
            </Link>
          </div>
        </div>

        {/* Conditional rendering based on login status */}
        <div className="flex flex-wrap gap-4 p-3">
          {isLoggedIn ? (
            // Display Profile dropdown
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="bg-[#1a1a1a] text-white py-2 px-4 font-medium flex items-center transition-colors"
              >
                <CircleUserRound color="#8e1616" size={32}/>
              </button>

              {/* Dropdown menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-lg">
                <Link
                  to="/CustomerProfile"
                  className="block px-4 py-2 text-white hover:bg-[#D84040] transition-colors"
                  onClick={() => setIsProfileDropdownOpen(false)}
                >
                  Profile
                </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-white hover:bg-[#D84040] transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Display Login and SignUp options
            <>
              <Link
                to="/LoginC"
                className="bg-[#8E1616] hover:bg-[#d84040] text-white py-2 px-4 font-medium transition-colors"
                >
                Login
              </Link>
              <Link
                to="/SignUpC"
                className="border border-white text-white hover:bg-white hover:text-[#1d1616] px-4 py-2 font-medium transition-colors"
                >
                SignUp
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>

      {/* Mobile menu - centered */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#1d1616] w-full">
          <div className="flex flex-col items-center space-y-4 px-4 py-6">
            <Link to="/" className="hover:text-[#E63946] transition-colors" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link
              to="/services"
              className="hover:text-[#E63946] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link to="/about" className="hover:text-[#E63946] transition-colors" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
            <Link
              to="/contact"
              className="hover:text-[#E63946] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            {isLoggedIn ? (
              // Display Profile, Edit Profile, and Logout options for mobile
              <>
                <Link
                  to="/CustomerProfile"
                  className="hover:text-[#E63946] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button onClick={handleLogout} className="hover:text-[#E63946] transition-colors">
                  Logout
                </button>
              </>
            ) : (
              // Display Login and SignUp options for mobile
              <>
                <Link
                  to="/LoginC"
                  className="hover:text-[#E63946] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/SignUpC"
                  className="hover:text-[#E63946] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  SignUp
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBarC;

