// src/pages/SystemWebsite/Admin.js
import React from 'react';
import SideNavBar from '../../components/systemWebsite/systemLayout/SideNavBar';
import TopNavBar from '../../components/systemWebsite/systemLayout/TopNavBar';
import { NavigationProvider, useNavigation } from '../../components/systemWebsite/NavigationContext';
import AddUserForm from '../../components/systemWebsite/systemLayout/AddUserForm';
import DisplayUser from '../../components/systemWebsite/systemLayout/DisplayUser'
import BookingList from '../../components/systemWebsite/customerMangement/BookingList';

// Component mapping - import all the components you need here
const componentRegistry = {
  'AddUserForm': AddUserForm,
  // Add other components as needed
  'DisplayUser': DisplayUser,
  // You can add placeholder components for the rest
  'BookingList': BookingList,
};

// Content renderer component
const ContentRenderer = () => {
  const { currentComponent } = useNavigation();
  
  if (!currentComponent) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">Welcome to FixMate Dashboard</h2>
        <p className="mt-2">Please select an option from the navigation.</p>
      </div>
    );
  }
  
  const Component = componentRegistry[currentComponent];
  return Component ? <Component /> : <div></div>;
};

const Admin = () => {
  return (
    <NavigationProvider>
      <div className="flex h-screen">
        <SideNavBar />
        <div className="flex-1 flex flex-col">
          <TopNavBar />
          <div className="flex-1 overflow-y-auto" style={{paddingTop: "40px"}}>
            <ContentRenderer />
          </div>
        </div>
      </div>
    </NavigationProvider>
  );
};

export default Admin;