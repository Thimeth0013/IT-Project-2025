<<<<<<< HEAD
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Customer Website
import CustomerHome from './pages/CustomerWebsite/cHome'
import BookingForm from './components/customerWebsite/BookingForm';
import SlotSelection from "./components/customerWebsite/SlotSelectBooking";
import ViewList from './components/BookingList'
import About from './pages/CustomerWebsite/AboutC'
import LoginC from './components/customerWebsite/LoginC';  // Your Login component
import SignUpC from './components/customerWebsite/SignUpC'; // Your SignUp component

// System Website

// import Supplier
import ItemDashboard from './pages/SupplyManagement/Manager/ItemDashboard';
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

// Import admin
import AddUserForm from './components/systemWebsite/AddUserForm';

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
        <Route path="/AddUserForm" element={<AddUserForm/>} />

=======
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import InventoryDashboard from "./components/InventoryDashboard";
import Addstock from "./components/addstock";


export default function App() {
  return (
     <Router>
      <Routes>
        {/* ✅ Redirect "/" to "/inventory" */}
        <Route path="/" element={<Navigate to="/inventory" />} />
        <Route path="/inventory" element={<InventoryDashboard />} />
        <Route path="/add-stock" element={<Addstock />} />
        {/* ❌ If no route matches, show a Not Found page */}
        <Route path="*" element={<h2>Page Not Found </h2>} />
>>>>>>> 508a705 (Updated backend routes and added frontend module)
      </Routes>
    </Router>
  );
}
<<<<<<< HEAD

export default App;
=======
>>>>>>> 508a705 (Updated backend routes and added frontend module)
