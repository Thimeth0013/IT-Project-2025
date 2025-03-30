import React, { createContext, useState, useContext } from 'react';
import { navigationData } from '../systemWebsite/navigationData';

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const [activeMainNav, setActiveMainNav] = useState('dashboard');
  const [activeSubNav, setActiveSubNav] = useState('');
  const [currentComponent, setCurrentComponent] = useState(null);

  const getSubNavItems = () => {
    const mainNav = navigationData.find((nav) => nav.id === activeMainNav);
    return mainNav ? mainNav.subItems : [];
  };

  return (
    <NavigationContext.Provider
      value={{
        activeMainNav,
        setActiveMainNav,
        activeSubNav,
        setActiveSubNav,
        currentComponent,
        setCurrentComponent,
        getSubNavItems,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);