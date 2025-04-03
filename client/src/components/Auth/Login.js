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
    setError(''); 

    try {
      const response = await fetch('https://support-9hv8.onrender.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
  
      const isJson = response.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await response.json() : null;
  
      if (!response.ok) {
        throw new Error(data?.error || 'Login failed');
      }
  
      // Success
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
  
    
    // old handle code
    // if (!formData.email || !formData.password) {
    //   setError('Email and password are required');
    //   return;
    // }
    //
    // try {
    //   const response = await fetch('https://support-9hv8.onrender.com/api/login', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     credentials: 'include',
    //     body: JSON.stringify(formData)
    //   });
      
    //   try {
    //     const response = await fetch('https://support-9hv8.onrender.com/api/login', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json'
    //       },
    //       credentials: 'include',
    //       body: JSON.stringify(formData)
    //     });
      
    //     const isJson = response.headers.get('content-type')?.includes('application/json');
    //     const data = isJson ? await response.json() : null;
      
    //     if (!response.ok) {
    //       throw new Error(data?.error || 'Login failed');
    //     }
      
    //     navigate('/dashboard');
      
    //   } catch (err) {
    //     setError(err.message || 'Something went wrong');
    //   }
      
       

      if (!response.ok) { 
        throw new Error(data.error || 'Login failed');
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return ( 
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