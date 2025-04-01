import React from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';

function Dashboard() { // basic outline for the Dashboard, not used for part 2
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Yoru Apparel Support Dashboard</h1>
        <nav className="dashboard-nav">
          <Link to="/dashboard" className="nav-link">My Tickets</Link>
          <Link to="/submit" className="nav-link">Create Ticket</Link>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </nav>
      </header>
      
      <main className="dashboard-content">
        {/* outlet will render ticketlist and stuff */}
        <Outlet context={{ user }} />
      </main>
    </div>
  );
}

export default Dashboard;