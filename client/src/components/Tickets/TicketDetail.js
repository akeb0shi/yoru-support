import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TicketDetail.css';

function TicketDetail() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // reply stuff
  const [replyText, setReplyText] = useState('');
  const [replyError, setReplyError] = useState('');


  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await fetch(`https://support-9hv8.onrender.com/api/tickets/${id}`, {
          credentials: 'include'
        });

        const isJson = response.headers
          .get('content-type')
          ?.includes('application/json');

        const data = isJson ? await response.json() : null;

        if (!response.ok) {
          throw new Error(data?.error || 'Failed to load ticket');
        }

        setTicket(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  // reply submission handling
  const handleReplySubmit = async () => {
    if (!replyText.trim()) {
      setReplyError('Reply cannot be empty');
      return;
    }
  
    try {
      const response = await fetch(`https://support-9hv8.onrender.com/api/replies/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ message: replyText })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to send reply');
      }
  
      setTicket(prev => ({
        ...prev,
        replies: [...prev.replies, data] // add new reply to the ticket
      }));
      setReplyText('');
      setReplyError('');
    } catch (err) {
      setReplyError(err.message);
    }
  };
  

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading ticket details...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!ticket) { 
    return <div className="empty-ticket">Ticket not found</div>;
  }

  return (
    <div className="ticket-detail-container">
      <button 
        onClick={() => navigate(-1)} 
        className="back-button"
      >
        Back to Tickets
      </button>
      
      <div className="ticket-detail-card">
        <div className="ticket-header">
          <h2 className="ticket-subject">{ticket.subject}</h2>
          <span className={`ticket-status status-${ticket.status.toLowerCase()}`}>
            {ticket.status}
          </span>
        </div>

        <div className="ticket-meta">
          {ticket.orderNumber && (
            <span className="ticket-order-number">Order #: {ticket.orderNumber}</span>
          )}
          <span className="ticket-date">
            Created: {new Date(ticket.createdAt).toLocaleString()}
          </span>
        </div>

        <div className="ticket-message">
          <h3>Message</h3>
          <p>{ticket.message}</p>
        </div>

        <div className="ticket-replies">
          <h3>Replies ({ticket.replies?.length || 0})</h3>
          {ticket.replies?.length > 0 ? (
            <ul className="reply-list">
              {ticket.replies.map(reply => (
                <li key={reply.id} className="reply-item">
                  <div className="reply-meta">
                    <span className="reply-author">{reply.user?.name || 'Support'}</span>
                    <span className="reply-date">
                      {new Date(reply.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="reply-message">
                    {reply.message}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-replies">No replies yet</p>
          )}
        </div>
        
        <div className="ticket-reply-form">
          <h3>Leave a Reply</h3>
          <textarea
            rows="4"
            placeholder="Write your reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="reply-textarea"
          />
          <button onClick={handleReplySubmit} className="reply-submit-button">
            Send Reply
          </button>
          {replyError && <p className="reply-error">{replyError}</p>}
        </div>

      </div>
    </div>
  );
}

export default TicketDetail;