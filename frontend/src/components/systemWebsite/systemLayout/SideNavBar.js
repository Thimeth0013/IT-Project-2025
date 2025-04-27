import React from 'react';
import { useNavigation } from '../NavigationContext';
import { navigationData } from '../navigationData';
import {
  User,
  Blocks,
  PackageIcon,
  ChartNoAxesCombined,
  TruckIcon,
  BriefcaseIcon,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Sidebar = () => {
  const { activeMainNav, setActiveMainNav } = useNavigation();
  const navigate = useNavigate();

  // Retrieve the current user's role from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const userRole = currentUser ? currentUser.role : 'Guest'; // Default to 'Guest' if no role is found

  // Logout function
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Replace the current history entry with the login page
    window.history.replaceState(null, '', '/login');

    // Redirect to the login page
    navigate('/LoginC', { replace: true });
  };

  // Filter navigation items based on user role
  const filteredNavigationData = navigationData.filter((navItem) => {
    // If the navItem has no roles specified, allow all users to access it
    if (!navItem.roles) return true;

    // Otherwise, check if the user's role is included in the allowed roles
    return navItem.roles.includes(userRole);
  });

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'user':
        return <User size={20} />;
      case 'package':
        return <PackageIcon size={20} />;
      case 'blocks':
        return <Blocks size={20} />;
      case 'truck':
        return <TruckIcon size={20} />;
      case 'charts':
        return <ChartNoAxesCombined size={20} />;
      case 'briefcase':
        return <BriefcaseIcon size={20} />;
      case 'shield':
        return <ShieldCheck size={20} />;
      default:
        return <LogOut size={20} />;
    }
  };

  const handleNavClick = (navId) => {
    setActiveMainNav(navId); // Set the active main navigation item
  };

  return (
    <div className="w-64 bg-blue-800 text-white h-full flex flex-col">
      <div className="p-5 border-b border-blue-700">
        <h1 className="text-xl font-bold">FixMate System</h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul>
          {filteredNavigationData.map((navItem) => (
            <li key={navItem.id}>
              <button
                onClick={() => handleNavClick(navItem.id)}
                className={`flex items-center w-full px-6 py-3 text-left ${
                  activeMainNav === navItem.id ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-700'
                }`}
              >
                <span className="mr-3">{getIcon(navItem.icon)}</span>
                {navItem.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-blue-700">
        <div className="flex items-center cursor-pointer" onClick={handleLogout}>
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-3">
            <LogOut size={16} />
          </div>
          <div>
            <p className="text-sm font-medium">Log Out</p>
            <p className="text-xs text-blue-300">{userRole}</p> {/* Display the user's role */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;