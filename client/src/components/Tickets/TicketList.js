import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './TicketList.css';


function TicketList() { // base TicketList creation function
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  const handleViewTicket = (ticketId) => {
    navigate(`/tickets/${ticketId}`);
  };

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

  return (
    <div className="ticket-list-container">
      <div className="ticket-list-header">
        <h2 className="ticket-list-title">Your Support Tickets</h2>
        <button 
          onClick={() => navigate('/submit')}
          className="create-ticket-button"
        >
          Create Ticket
        </button>
      </div>
    
      {tickets.length === 0 ? (
        <div className="empty-tickets">
          <p>No tickets found.</p>
          <Link to="/submit" className="create-ticket-link">
            Create your first ticket
          </Link>
        </div>
      ) : (
        <ul className="ticket-list">
          {tickets.map(ticket => (
            <li key={ticket.id} className="ticket-list-item">
              <div className="ticket-content">
                <div className="ticket-header">
                  <div className="ticket-subject-wrapper">
                    <h3 className="ticket-subject">{ticket.subject}</h3>
                    <span className={`ticket-status status-${ticket.status.toLowerCase()}`}>
                      {ticket.status}
                    </span>
                  </div>
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
                <button 
                  onClick={() => handleViewTicket(ticket.id)}
                  className="view-ticket-button"
                >
                  View Details
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TicketList;