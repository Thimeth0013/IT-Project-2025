import React from 'react';
import { useNavigation } from '../NavigationContext';
import { BellIcon, Search } from 'lucide-react';
import { navigationData } from '../navigationData';

export const TopNav = () => {
  const { 
    activeMainNav, 
    activeSubNav, 
    setActiveSubNav, 
    getSubNavItems, 
    setCurrentComponent 
  } = useNavigation();

  const subNavItems = getSubNavItems();

  // Find the current main navigation item for the title
  const currentMainNav = navigationData.find((nav) => nav.id === activeMainNav);

  // Handle sub-navigation item click and set the current component
  const handleSubNavClick = (subItem) => {
    setActiveSubNav(subItem.id);

    // Set the current component based on the selected sub-nav item
    if (subItem.component) {
      setCurrentComponent(subItem.component);
    }
  };

  return (
    <div className="bg-white shadow-sm">
      {/* Top Bar */}
      <div className="px-6 py-4 flex justify-between items-center border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800">{currentMainNav?.label || 'Dashboard'}</h1>

        <div className="flex items-center space-x-4">

          {/* Notification Icon */}
          <button className="p-2 rounded-full hover:bg-gray-100 relative">
            <BellIcon size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>

      {/* Sub Navigation */}
      {subNavItems.length > 0 && (
        <div className="px-6 overflow-x-auto">
          <nav className="flex space-x-1">
            {subNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSubNavClick(item)}  // Use the new handleSubNavClick function
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                  activeSubNav === item.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-blue-600 hover:border-b-2 hover:border-blue-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};

export default TopNav;
