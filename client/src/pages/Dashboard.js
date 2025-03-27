import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() { // basic outline for the Dashboard, not used for part 2
  return (
    <div>
      <header>
        <h1>Yoru Apparel Support Dashboard</h1>
        <nav>
          <Link to="/dashboard">My Tickets</Link> | 
          <Link to="/submit">Create Ticket</Link> | 
          <Link to="/logout">Logout</Link>
        </nav>
      </header>
      
      <main>
        {/* To be implemented in a later part of the project */}
      </main>
    </div>
  );
}

export default Dashboard;