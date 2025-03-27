import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() { // base Login function, still need to implement API connection stuff
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  return ( // basic formatting for output, any values that follow "onSubmit" and "onChange" still need to be implemented
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
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <a href="/register">Register here</a></p>
    </div>
  );
}

export default Login;