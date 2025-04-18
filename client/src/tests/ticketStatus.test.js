import { render, screen, waitFor } from '@testing-library/react';
import TicketList from '../components/Tickets/TicketList';
import { BrowserRouter } from 'react-router-dom';

// mock fetch API
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        {
          id: 1,
          subject: 'Test Ticket 1',
          status: 'OPEN',
          orderNumber: '12345',
          replies: [],
          createdAt: '2023-01-01'
        },
        {
          id: 2,
          subject: 'Test Ticket 2',
          status: 'RESOLVED',
          orderNumber: '67890',
          replies: [{}, {}],
          createdAt: '2023-01-02'
        }
      ]),
      headers: new Headers({ 'content-type': 'application/json' })
    })
  );
});

test('correctly displays ticket status badges', async () => {
  render(
    <BrowserRouter>
      <TicketList />
    </BrowserRouter>
  );

  // check that it loads
  expect(screen.getByText('Loading tickets...')).toBeTruthy();

  // wait for loading to finish
  await waitFor(() => {
    expect(screen.queryByText('Loading tickets...')).toBeNull();
  });

  // check all the data is there and correct
  const openStatus = screen.getByText(/open/i);
  const resolvedStatus = screen.getByText(/resolved/i);
  const ticketItems = screen.getAllByRole('listitem');

  expect(openStatus).toBeTruthy();
  expect(resolvedStatus).toBeTruthy();
  expect(openStatus.className).toMatch('status-open');
  expect(resolvedStatus.className).toMatch('status-resolved');
  expect(ticketItems.length).toBe(2);
});