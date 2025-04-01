import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() { // base Register function
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  // handles any changes in the registration form
  const formChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // handles when a registration form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // error message template

    // check all fields are filled in
    if (!formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    // TODO: Might need extra checks to ensure email, password, etc. are valid

    try {
      // send registration request to API
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // security measure for cookies
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) { // error check for invalid input
        throw new Error(data.error || 'Registration failed');
      }

      // go to dashboard on successful registration
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } 
  };

  return ( // basic formatting for output
    <div>
      <h2>Register</h2> 
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
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <a href="/login">Login here</a></p>
    </div>
  );
}

export default Register;