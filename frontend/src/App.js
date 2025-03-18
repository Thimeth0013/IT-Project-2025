import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/Home';
import CustomerLayout from './components/customerWebsite/CustomerLayout';
// import CustomerHome from './pages/cHome'
import BookingForm from './components/customerWebsite/BookingForm';
import SlotSelection from "./components/customerWebsite/SlotSelectBooking";
import ViewList from './components/BookingList'
import About from './pages/AboutC'

function App() {
  return (
    <Router>
      <CustomerLayout>
      <Routes>
        <Route path='/' element={<HomePage/>} />
        {/* <Route path="/SlotSelectBooking" element={<SlotSelection />} /> */}
        <Route path='/BookingForm' element={<BookingForm/>}/>
        <Route path='/About' element={<About/>}/>
      </Routes>
      </CustomerLayout>
    </Router>
  );
}

export default App;
