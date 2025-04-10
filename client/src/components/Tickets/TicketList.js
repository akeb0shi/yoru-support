import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TicketList.css';


function TicketList() { // base TicketList creation function
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('https://support-9hv8.onrender.com/api/tickets', {
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
      } finally {
        setLoading(false);
      }
    };
  
    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading tickets...</p>
      </div>
    );
  }
  
  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (tickets === null || tickets.length === 0) { // for if there are no tickets
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
    <div className="ticket-list-container">
      <h2 className="ticket-list-title">Your Support Tickets</h2>
    
      <ul className="ticket-list">
        {tickets.map(ticket => (
          <li key={ticket.id} className="ticket-list-item">
            <Link to={`/tickets/${ticket.id}`} className="ticket-link">
              <div className="ticket-header">
                <h3 className="ticket-subject">{ticket.subject}</h3>
                <span className={`ticket-status status-${ticket.status.toLowerCase()}`}>
                  {ticket.status}
                </span>
              </div>
              
              <div className="ticket-meta">
                {ticket.orderNumber && (
                  <span className="ticket-order-number">Order #: {ticket.orderNumber}</span>
                )}
                <span className="ticket-replies">
                  {ticket.replies?.length || 0} {ticket.replies?.length === 1 ? 'reply' : 'replies'}
                </span>
                <span className="ticket-date">
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