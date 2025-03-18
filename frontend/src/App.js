import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/Home';
import CustomerLayout from './components/customerWebsite/CustomerLayout';
// import CustomerHome from './pages/cHome'
import BookingForm from './components/customerWebsite/BookingForm';
// import SlotSelection from "./components/customerWebsite/SlotSelectBooking";
// import ViewList from './components/BookingList'
// import About from './pages/AboutC'

// import Supplier
import ItemDashboard from './components/SupplyManagement/ItemDashboard';
import MainDashboard from './components/SupplyManagement/MainDashboard';
import OrderDashboard from './components/SupplyManagement/OrderDashboard';
import OrderForm from './components/SupplyManagement/OrderForm';
import StockTransactionDashboard from './components/SupplyManagement/StockTransactionDashboard';
import SupplierDashboard from './components/SupplyManagement/SupplierDashboard';
import SupplierForm from './components/SupplyManagement/SupplierForm';
import SupplyDashboard from './components/SupplyManagement/SupplyDashboard';
import SupplyOrderList from './components/SupplyManagement/SupplyOrderList';

// import Supply
import SupplierOrderDashboard from './components/Supply/SupplierOrderDashboard';
// import SupplyDashboard from './components/Supply/SupplyDashboard';
// import SupplyOrderList from './components/Supply/SupplyOrderList';

function App() {
  return (
    <Router>
      <CustomerLayout>
      <Routes>
        <Route path='/' element={<HomePage/>} />
        {/* <Route path="/SlotSelectBooking" element={<SlotSelection />} /> */}
        <Route path='/BookingForm' element={<BookingForm/>}/>
        {/* <Route path='/About' element={<About/>}/> */}

        {/* Supplier */}
        <Route path="/suppliers" element={<MainDashboard />} />
        <Route path="/suppliers/items" element={<ItemDashboard />} />
        <Route path="/suppliers/orders" element={<OrderDashboard />} />
        <Route path="/suppliers/orders/new" element={<OrderForm />} />
        <Route path="/suppliers/stock-transactions" element={<StockTransactionDashboard />} />
        <Route path="/suppliers/suppliers" element={<SupplierDashboard />} />
        <Route path="/suppliers/new" element={<SupplierForm />} />
        <Route path="/suppliers/supply" element={<SupplyDashboard />} />
        <Route path="/suppliers/supply/orders" element={<SupplyOrderList />} />

        {/* Supply */}
        <Route path="/supply" element={<SupplierOrderDashboard />} />
        <Route path="/supply/supply" element={<SupplyDashboard />} />
        <Route path="/supply/supply/orders" element={<SupplyOrderList />} />
      </Routes>
      </CustomerLayout>
    </Router>
  );
}

export default App;
