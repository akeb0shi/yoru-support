import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateTicket from '../components/Tickets/CreateTicket.js';
import { BrowserRouter } from 'react-router-dom';

test('allows user to create a support ticket', async () => {
  // Mock successful API response
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    })
  );

  render(
    <BrowserRouter>
      <CreateTicket />
    </BrowserRouter>
  );

  // filling out form
  fireEvent.change(screen.getByLabelText(/subject/i), {
    target: { value: 'Order not received' }
  });
  fireEvent.change(screen.getByLabelText(/message/i), {
    target: { value: 'I never got my package' }
  });
  fireEvent.change(screen.getByLabelText(/order number/i), {
    target: { value: '12345' }
  });

  // submitting form
  fireEvent.click(screen.getByRole('button', { name: /submit ticket/i }));

  // redirect works
  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith(
      'https://support-9hv8.onrender.com/api/tickets',
      expect.objectContaining({
        method: 'POST',
        credentials: 'include'
      })
    );
  });
});