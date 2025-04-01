import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import TicketList from './components/Tickets/TicketList';
import CreateTicket from './components/Tickets/CreateTicket';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Guest from './pages/Guest'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<TicketList />} />
        <Route path="/submit" element={<CreateTicket />} />
        {/* <Route path="/guest" element={<Guest />} /> */}
      </Routes>
    </Router>
    
  );
}

export default App;