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
        <h1>Yoru Apparel Support Dashboard</h1>
        <nav className="dashboard-nav">
          <Link to="/dashboard" className="nav-link">My Tickets</Link>
          <Link to="/submit" className="nav-link">Create Ticket</Link>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </nav>
      </header>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <main className="dashboard-content">
        <Outlet context={{ user }} />
      </main>
    </div>
  );
}

export default Dashboard;
