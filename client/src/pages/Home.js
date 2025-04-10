import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Yoru Apparel Support Center</h1>
        <p className="home-description">
          Welcome to Yoru Apparel's customer support network! Please log in or register to submit a support ticket.
        </p>
        <div className="home-actions">
          <Link to="/login" className="home-button login-button">Login</Link>
          <Link to="/register" className="home-button register-button">Register</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;