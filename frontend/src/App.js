import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Customer Website
import CustomerHome from './pages/CustomerWebsite/cHome'
import BookingForm from './components/customerWebsite/BookingForm';
import SlotSelection from "./components/customerWebsite/SlotSelectBooking";
import About from './pages/CustomerWebsite/AboutC'
import LoginC from './components/customerWebsite/LoginC';  // Your Login component
import SignUpC from './components/customerWebsite/SignUpC'; // Your SignUp component

// System Website
import Admin  from './pages/SystemWebsite/Admin';

import PettyCashHome from  './pages/PettyCashHome';
import PettyCashDashboard from './pages/PettyCashDashboard';

// import Supplier
import ItemDashboard from './pages/SupplyManagement/Manager/SupplierDashboard';
import SuppliersHomepage from './pages/SupplyManagement/Manager/SuppliersHomepage';
import OrderDashboard from './pages/SupplyManagement/Manager/SuppliersOrderDashboard';
import OrderForm from './pages/SupplyManagement/Manager/OrderForm';
import StockTransactionDashboard from './pages/SupplyManagement/Manager/StockTransactionDashboard';
import SuppliersAll from './pages/SupplyManagement/Manager/SuppliersAll';
import SupplierForm from './pages/SupplyManagement/Manager/SupplierForm';
import SupplyDashboard from './pages/SupplyManagement/Manager/SupplyDashboard';
import SupplyOrderList from './pages/SupplyManagement/Manager/SupplyOrderList';

// import Supply
import SupplierOrderDashboard from './pages/SupplyManagement/Supplier/SupplierOrderDashboard';
// import SupplyDashboard from './components/Supply/SupplyDashboard';
// import SupplyOrderList from './components/Supply/SupplyOrderList';

//import Inventory
import Addstock from './components/addstock';
import InventoryDashboard from './components/inventoryDash';

function App() {
  return (
    <Router>
      <Routes>
        {/* Customer Website*/}
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
        <Route path="/suppliers/stock-transactions" element={<StockTransactionDashboard />} />
        <Route path="/suppliers/new" element={<SupplierForm />} />
        <Route path="/suppliers/supply" element={<SupplyDashboard />} />
        <Route path="/suppliers/supply/orders" element={<SupplyOrderList />} />

        {/* Supply */}
        <Route path="/supply" element={<SupplierOrderDashboard />} />
        <Route path="/supply/supply" element={<SupplyDashboard />} />
        <Route path="/supply/supply/orders" element={<SupplyOrderList />} />

        {/* Admin */}
        <Route path='/Admin' element={<Admin/>}/>
        <Route path="/AddUserForm" element={<AddUserForm/>} />
      
      
     <Route path="/pettycash" element={<PettyCashHome />} />
     <Route path="/pettycash/new" element={<PettyCashDashboard />} />
      {/* </PettyCash> */}

      {/* </Inventory> */}
      <Route path="/" element={<Navigate to="/inventory" />} />
      <Route path="/inventory" element={<InventoryDashboard />} />
      <Route path="/add-stock" element={<Addstock />} />
      </Routes>
    
    </Router>
)}

