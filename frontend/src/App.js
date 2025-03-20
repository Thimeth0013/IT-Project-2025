import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { Navigate } from 'react-router-dom';

import HomePage from './pages/Home';
// import CustomerLayout from './components/customerWebsite/CustomerLayout';
// import CustomerHome from './pages/cHome'
// import BookingForm from './components/customerWebsite/BookingForm';
// import SlotSelection from "./components/customerWebsite/SlotSelectBooking";
// import ViewList from './components/BookingList'
// import CompanyOverview from './pages/AboutC'

// Customer Website
// import CustomerHome from './pages/CustomerWebsite/cHome'
// import BookingForm from './components/customerWebsite/BookingForm';
// import SlotSelection from "./components/customerWebsite/SlotSelectBooking";
// import About from './pages/CustomerWebsite/AboutC'
// import LoginC from './components/customerWebsite/LoginC';  // Your Login component
// import SignUpC from './components/customerWebsite/SignUpC'; // Your SignUp component

// System Website
import Admin  from './pages/SystemWebsite/Admin';
import CustomerM from './pages/SystemWebsite/CustomerM';
import AddUserForm from './components/systemWebsite/systemLayout/AddUserForm';

//pettycash
import PettyCashHome from  './pages/PettyCashHome';
import PettyCashDashboard from './pages/PettyCashDashboard';
// Import  payment   component
import PaymentGateway from './components/PaymentGateway/payment';

// import Supplier
import ItemDashboard from './pages/SupplyManagement/Manager/SuppliersItemDashboard';
import SuppliersHomepage from './pages/SupplyManagement/Manager/SuppliersHomepage';
import OrderDashboard from './pages/SupplyManagement/Manager/SuppliersOrderDashboard';
import OrderForm from './pages/SupplyManagement/Manager/OrderForm';
import SuppliersStockTransactionDashboard from './pages/SupplyManagement/Manager/SuppliersStockTransactionDashboard';
import SuppliersAll from './pages/SupplyManagement/Manager/SuppliersAll';
import SupplierForm from './pages/SupplyManagement/Manager/SupplierNewForm';
import SupplyDashboard from './pages/SupplyManagement/Manager/SupplyDashboard';
import SupplyOrderList from './pages/SupplyManagement/Manager/SupplyOrderList';

// import Supply
import SupplierOrderRequestsDashboard from './pages/SupplyManagement/Supplier/SupplierOrderRequestsDashboard';
// import SupplyDashboard from './components/Supply/SupplyDashboard';
// import SupplyOrderList from './components/Supply/SupplyOrderList';

//import Inventory
//import Addstock from './components/addstock';
//import InventoryDashboard from './components/inventoryDash';

function App() {
  return (
    <Router>
      {/* <CustomerLayout> */}
      <Routes>
        <Route path='/' element={<HomePage/>} />
        {/* <Route path="/SlotSelectBooking" element={<SlotSelection />} /> */}
        {/* <Route path='/BookingForm' element={<BookingForm/>}/> */}
        {/* <Route path='/About' element={<CompanyOverview/>}/> */}
        {/* Customer Website*/}
      {/*
        <Route path='/' element={<CustomerHome/>} />
        <Route path="/SlotSelectBooking" element={<SlotSelection />} />
        <Route path='/BookingForm' element={<BookingForm/>}/>
        <Route path='/About' element={<About/>}/>
        <Route path="/LoginC" element={<LoginC />} /> {/* Login route */}
        <Route path="/SignUpC" element={<SignUpC />} /> {/* SignUp route */}

        {/* System Website*/}

        {/* Supplier */}
        <Route path="/suppliers" element={<SuppliersHomepage />} />
        <Route path="/suppliers/all" element={<SuppliersAll />} />
        <Route path="/suppliers/items" element={<ItemDashboard />} />
        <Route path="/suppliers/orders" element={<OrderDashboard />} />
        <Route path="/suppliers/orders/new" element={<OrderForm />} />
        <Route path="/suppliers/stock-transactions" element={<SuppliersStockTransactionDashboard />} />
        <Route path="/suppliers/new" element={<SupplierForm />} />
        <Route path="/suppliers/supply" element={<SupplyDashboard />} />
        <Route path="/suppliers/supply/orders" element={<SupplyOrderList />} />

        {/* Supply */}
        <Route path="/supply" element={<SupplierOrderRequestsDashboard />} />
        <Route path="/supply/supply" element={<SupplyDashboard />} />
        <Route path="/supply/supply/orders" element={<SupplyOrderList />} />

        {/* Admin
        <Route path='/Admin' element={<Admin/>}/>
        <Route path="/AddUserForm" element={<AddUserForm/>} />

        <Route path="/CustomerM" element={<CustomerM/>}/>
      
     <Route path="/pettycash" element={<PettyCashHome />} />
     <Route path="/pettycash/new" element={<PettyCashDashboard />} />
     
        {/* Add Finance Management Routes */}
       {/* Add finance routes */}

        <Route path="/payment" element={<PaymentGateway    />} />
      {/* </PettyCash>  and payment*/}

        {/* </Inventory> */}
        {/*<Route path="/" element={<Navigate to="/inventory" />} />
        <Route path="/inventory" element={<InventoryDashboard />} />
        <Route path="/add-stock" element={<Addstock />} />*/}
      </Routes>
    
    </Router>
  );
}

export default App;
