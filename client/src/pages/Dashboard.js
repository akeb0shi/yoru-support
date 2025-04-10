import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('https://support-9hv8.onrender.com/api/me', {
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
    await fetch('https://support-9hv8.onrender.com/api/logout', {
      method: 'POST',
      credentials: 'include'
    });
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="logo">Yoru Apparel Support</h1>
          <nav className="dashboard-nav">
            <Link to="/dashboard" className="nav-link">My Tickets</Link>
            <Link to="/submit" className="nav-link">Create Ticket</Link>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </nav>
        </div>
      </header>

      <main className="main-content">
        {error && (
          <div className="error-state">
            <svg className="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}
        
        <div className="content-card">
          <Outlet context={{ user }} />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
