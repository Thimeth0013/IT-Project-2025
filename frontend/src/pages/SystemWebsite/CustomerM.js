import React from 'react';
import SideNavBar from '../../components/systemWebsite/systemLayout/SideNavBar';
import TopNavBar from '../../components/systemWebsite/systemLayout/TopNavBar';
import { NavigationProvider, useNavigation } from '../../components/systemWebsite/NavigationContext';
import BookingList from '../../components/systemWebsite/customerMangement/BookingList';
import AddServiceForm from '../../components/systemWebsite/customerMangement/addServices';

// Component mapping - import all the components you need here
const componentRegistry = {
    'BookingList': BookingList,
    'AddServiceForm': AddServiceForm,
    // Add other components as needed
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

const CustomerM = () => {
  return (
    <NavigationProvider> {/* Wrap with NavigationProvider */}
      <div className="flex h-screen">
        <SideNavBar />
        <div className="flex-1 flex flex-col">
          <TopNavBar />
          <div className="flex-1 overflow-y-auto" style={{ paddingTop: "40px" }}>
            <ContentRenderer />
          </div>
        </div>
      </div>
    </NavigationProvider>
  );
};

export default CustomerM;