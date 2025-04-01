import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/me', {
          method: 'GET',
          credentials: 'include'
        });

        // Check if response is JSON
        const isJson = res.headers.get('content-type')?.includes('application/json');
        const data = isJson ? await res.json() : null;

        if (!res.ok) {
          throw new Error(data?.error || 'Failed to fetch user info');
        }

        setUser(data);
      } catch (err) {
        setError(err.message);
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include'
    });
    navigate('/login');
  };

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
