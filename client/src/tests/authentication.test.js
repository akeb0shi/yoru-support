import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../components/Auth/Login.js';
import { BrowserRouter } from 'react-router-dom';

test('handles login authentication flow', async () => {
  // mock sucessful login
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ user: { id: '123', email: 'test@example.com' } }),
      headers: new Headers({ 'content-type': 'application/json' })
    })
  );

  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

  // fill out login
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'test@example.com' }
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: 'password123' }
  });

  // submit login
  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  // get correct API call
  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith(
      'https://support-9hv8.onrender.com/api/login',
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      })
    );
  });
});