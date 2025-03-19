import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/Home';
// import CustomerLayout from './components/customerWebsite/CustomerLayout';
// import CustomerHome from './pages/cHome'
import BookingForm from './components/customerWebsite/BookingForm';
// import SlotSelection from "./components/customerWebsite/SlotSelectBooking";
// import ViewList from './components/BookingList'
import CompanyOverview from './pages/AboutC'

// import Supplier
import ItemDashboard from './pages/SupplyManagement/Manager/SuppliersItemDashboard';
import SuppliersHomepage from './pages/SupplyManagement/Manager/SuppliersHomepage';
import OrderDashboard from './pages/SupplyManagement/Manager/SuppliersOrderDashboard';
import OrderForm from './pages/SupplyManagement/Manager/OrderForm';
import SuppliersStockTransactionDashboard from './pages/SupplyManagement/Manager/SuppliersStockTransactionDashboard';
import SuppliersAll from './pages/SupplyManagement/Manager/SuppliersAll';
import SupplierForm from './pages/SupplyManagement/Manager/SupplierForm';
import SupplyDashboard from './pages/SupplyManagement/Manager/SupplyDashboard';
import SupplyOrderList from './pages/SupplyManagement/Manager/SupplyOrderList';

// import Supply
import SupplierOrderDashboard from './pages/SupplyManagement/Supplier/SupplierOrderDashboard';
// import SupplyDashboard from './components/Supply/SupplyDashboard';
// import SupplyOrderList from './components/Supply/SupplyOrderList';

function App() {
  return (
    <Router>
      {/* <CustomerLayout> */}
      <Routes>
        <Route path='/' element={<HomePage/>} />
        {/* <Route path="/SlotSelectBooking" element={<SlotSelection />} /> */}
        <Route path='/BookingForm' element={<BookingForm/>}/>
        <Route path='/About' element={<CompanyOverview/>}/>

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
        <Route path="/supply" element={<SupplierOrderDashboard />} />
        <Route path="/supply/supply" element={<SupplyDashboard />} />
        <Route path="/supply/supply/orders" element={<SupplyOrderList />} />
      </Routes>
      {/* </CustomerLayout> */}
    </Router>
  );
}

export default App;
