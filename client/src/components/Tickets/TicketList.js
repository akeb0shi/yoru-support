import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


function TicketList() { // base TicketList creation function
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('/api/tickets', {
          credentials: 'include'
        });
  
        const isJson = response.headers
          .get('content-type')
          ?.includes('application/json');
  
        const data = isJson ? await response.json() : null;
  
        if (!response.ok) {
          throw new Error(data?.error || 'Failed to load tickets');
        }
  
        setTickets(data);
      } catch (err) {
        setError(err.message);
      }
    };
  
    fetchTickets();
  }, []);
  

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (tickets.length === 0) { // for if there are no tickets
    return (
      <div className="empty-tickets">
        <p>No tickets found.</p>
        <Link to="/submit" className="create-ticket-link">
          Create your first ticket
        </Link>
      </div>
    );
  }

  return ( // formatting for the tickets
    <div className="ticket-list">
      <h2>Your Support Tickets</h2>
      
      <ul className="tickets">
        {tickets.map(ticket => (
          <li key={ticket.id} className="ticket-item">
            <Link to={`/tickets/${ticket.id}`} className="ticket-link">
              <div className="ticket-header">
                <h3>{ticket.subject}</h3>
                <span className={`status-badge ${ticket.status.toLowerCase()}`}>
                  {ticket.status}
                </span>
              </div>
              
              <div className="ticket-meta">
                {ticket.orderNumber && (
                  <span>Order #: {ticket.orderNumber}</span>
                )}
                <span>
                  {ticket.replies.length} {ticket.replies.length === 1 ? 'reply' : 'replies'}
                </span>
                <span>
                  Created: {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TicketList;