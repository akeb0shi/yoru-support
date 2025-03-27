import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() { // base Register function, still need to implement API connection stuff
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  return ( // basic formatting for output, any values that follow "onSubmit" and "onChange" still need to be implemented
    <div>
      <h2>Register</h2> 
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
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
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <a href="/login">Login here</a></p>
    </div>
  );
}

export default Register;