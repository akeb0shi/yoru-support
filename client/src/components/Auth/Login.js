import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() { // base Login function
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  // handles any changes in the login form
  const formChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // handles when a login form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // error message template
    
    // check that both fields are filled in
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }

    try {
      // send login request to API
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // security measure for cookies
        body: JSON.stringify(formData)
      });

      const data = await response.json(); 

      if (!response.ok) { // error check for invalid input
        throw new Error(data.error || 'Login failed');
      }

      // go to dashboard on successful login
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return ( // basic formatting for output 
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={formChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={formChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <a href="/register">Register here</a>
        {/* <br /> Or <a href="/guest">Continue as guest</a> */}
      </p>
    </div>
  );
}

export default Login;