import React from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';

function Dashboard() { // basic outline for the Dashboard, not used for part 2
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Yoru Apparel Support</h1>
        <nav>
          <Link to="/dashboard">Dashboard</Link> | 
          <Link to="/submit">New Ticket</Link> | 
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </nav>
      </header>

      <main className="dashboard-content">
        {error && <div className="error-banner">{error}</div>}
        
        {/* placeholder */}
        <div className="ticket-list-placeholder">
          <h2>Your Support Tickets</h2>
          <p>Temp</p>
          <div className="mock-ticket">
            <h3>Sample Ticket #1001</h3>
            <p>Status: Open</p>
            <p>Created: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* outlet for future stuff */}
        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard;