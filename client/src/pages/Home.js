import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Yoru Apparel Support Center</h1>
      <p>Welcome to Yoru Apparel's customer support network! Please log in or register to submit a support ticket.</p>
      <div>
        <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
      </div>
    </div>
  );
}

export default Home;